import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CodexReadinessService } from './codex-readiness-service';

const codexMocks = vi.hoisted(() => ({
  Codex: vi.fn(),
  run: vi.fn(),
  startThread: vi.fn(),
}));

vi.mock('@openai/codex-sdk', () => ({
  Codex: codexMocks.Codex,
}));

describe('CodexReadinessService', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    codexMocks.Codex.mockImplementation(() => ({
      startThread: codexMocks.startThread,
    }));
    codexMocks.startThread.mockReturnValue({
      run: codexMocks.run,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('starts unauthenticated by default', () => {
    const service = new CodexReadinessService();

    expect(service.getStatus()).toEqual({ isAuthenticated: false });
  });

  it('treats the mock provider as ready', async () => {
    vi.stubEnv('OPEN_PREP_AI_PROVIDER', 'mock');

    const service = new CodexReadinessService();

    await expect(service.signIn()).resolves.toEqual({ isAuthenticated: true });
    expect(codexMocks.Codex).not.toHaveBeenCalled();
  });

  it('marks Codex authenticated after a successful SDK readiness run', async () => {
    codexMocks.run.mockResolvedValue({ finalResponse: '{"ok":true}' });

    const service = new CodexReadinessService();
    const status = await service.signIn();

    expect(status).toEqual({ isAuthenticated: true });
    expect(service.getStatus()).toEqual({ isAuthenticated: true });
    expect(codexMocks.startThread).toHaveBeenCalledWith({
      model: 'gpt-5.4-mini',
      modelReasoningEffort: 'low',
      skipGitRepoCheck: true,
    });
  });

  it('keeps Codex unauthenticated when the SDK readiness run fails', async () => {
    codexMocks.run.mockRejectedValue(new Error('not signed in'));

    const service = new CodexReadinessService();

    await expect(service.signIn()).rejects.toThrow('not signed in');
    expect(service.getStatus()).toEqual({ isAuthenticated: false });
  });

  it('aborts the readiness run when the Codex timeout elapses', async () => {
    vi.stubEnv('OPEN_PREP_CODEX_TIMEOUT_MS', '1');
    codexMocks.run.mockImplementation((_prompt: string, options: { signal: AbortSignal }) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('aborted')));
      }),
    );

    const service = new CodexReadinessService();
    const signIn = service.signIn();

    await expect(signIn).rejects.toThrow('ChatGPT sign-in check timed out after 1ms.');
  });
});
