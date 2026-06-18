import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AiToolService } from './ai-tool-service';

const switchboardMocks = vi.hoisted(() => ({
  checkAuth: vi.fn(),
  connect: vi.fn(),
  discover: vi.fn(),
  startAuth: vi.fn(),
}));

vi.mock('switchboard-ai-sdk', () => ({
  connect: switchboardMocks.connect,
  discover: switchboardMocks.discover,
}));

describe('AiToolService', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    switchboardMocks.discover.mockResolvedValue([
      {
        id: 'codex',
        name: 'Codex',
        type: 'agent',
        available: true,
        capabilities: ['chat', 'health-check'],
        models: ['gpt-5-codex'],
        defaultModel: 'gpt-5-codex',
      },
      {
        id: 'ollama',
        name: 'Ollama',
        type: 'runtime',
        available: false,
        capabilities: ['chat'],
        metadata: { reason: 'CLI not found.' },
      },
    ]);
    switchboardMocks.connect.mockResolvedValue({
      checkAuth: switchboardMocks.checkAuth,
      startAuth: switchboardMocks.startAuth,
    });
    switchboardMocks.checkAuth.mockResolvedValue({
      authSupported: true,
      authenticated: true,
      authStatus: 'authenticated',
      reason: 'Ready',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('lists discovered tools with auth state', async () => {
    const service = new AiToolService();
    const tools = await service.listTools();

    expect(tools[0]).toMatchObject({
      id: 'codex',
      available: true,
      defaultModel: 'gpt-5-codex',
      authStatus: {
        isAuthenticated: true,
        status: 'authenticated',
      },
    });
    expect(tools[1]).toMatchObject({
      id: 'ollama',
      available: false,
      authStatus: {
        isAuthenticated: false,
        message: 'CLI not found.',
      },
    });
  });

  it('returns unauthenticated auth status', async () => {
    switchboardMocks.checkAuth.mockResolvedValue({
      authSupported: true,
      authenticated: false,
      authStatus: 'unauthenticated',
      reason: 'Login required',
    });

    const service = new AiToolService();

    await expect(service.getAuthStatus('codex')).resolves.toEqual({
      authSupported: true,
      isAuthenticated: false,
      status: 'unauthenticated',
      message: 'Login required',
      instructions: undefined,
    });
  });

  it('treats unsupported auth as ready', async () => {
    switchboardMocks.checkAuth.mockResolvedValue({
      authSupported: false,
      authenticated: null,
      authStatus: 'not_supported',
    });

    const service = new AiToolService();

    await expect(service.getAuthStatus('ollama')).resolves.toMatchObject({
      authSupported: false,
      isAuthenticated: true,
      status: 'not_supported',
    });
  });

  it('starts provider auth', async () => {
    switchboardMocks.startAuth.mockResolvedValue({
      status: 'already_authenticated',
      authenticated: true,
      command: 'codex login',
      message: 'Already signed in',
    });

    const service = new AiToolService();

    await expect(service.startAuth('codex')).resolves.toMatchObject({
      authSupported: true,
      isAuthenticated: true,
      status: 'authenticated',
      message: 'Already signed in',
    });
  });

  it('returns mock provider readiness in mock mode', async () => {
    vi.stubEnv('OPEN_PREP_AI_PROVIDER', 'mock');

    const service = new AiToolService();

    await expect(service.listTools()).resolves.toEqual([
      expect.objectContaining({
        id: 'claude-code',
        available: false,
      }),
      expect.objectContaining({
        id: 'codex',
        available: true,
        authStatus: expect.objectContaining({
          isAuthenticated: true,
        }),
      }),
      expect.objectContaining({
        id: 'opencode',
        available: true,
      }),
      expect.objectContaining({
        id: 'ollama',
        available: true,
      }),
    ]);
    expect(switchboardMocks.discover).not.toHaveBeenCalled();
  });
});
