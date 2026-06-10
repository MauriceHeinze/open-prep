import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CodexReadinessService } from './codex-readiness-service';

const childProcessMocks = vi.hoisted(() => ({
  execFile: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  default: {
    execFile: childProcessMocks.execFile,
  },
  execFile: childProcessMocks.execFile,
}));

vi.mock('./codex-sdk', () => ({
  resolveCodexCliProcessConfig: () => ({
    command: '/mock/codex',
    argsPrefix: [],
    env: { PATH: '/mock/bin' },
  }),
}));

type ExecFileCallback = (error: Error | null, stdout: string, stderr: string) => void;

const mockSuccessfulCodexCommand = (): void => {
  childProcessMocks.execFile.mockImplementation(
    (
      _command: string,
      _args: string[],
      _options: unknown,
      callback: ExecFileCallback,
    ) => {
      callback(null, 'Logged in using ChatGPT', '');
    },
  );
};

const mockFailedCodexCommand = (message: string): void => {
  childProcessMocks.execFile.mockImplementationOnce(
    (
      _command: string,
      _args: string[],
      _options: unknown,
      callback: ExecFileCallback,
    ) => {
      callback(new Error(message), '', message);
    },
  );
};

describe('CodexReadinessService', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    mockSuccessfulCodexCommand();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('starts unauthenticated when the bundled Codex CLI is not logged in', async () => {
    mockFailedCodexCommand('Not logged in');

    const service = new CodexReadinessService();

    await expect(service.getStatus()).resolves.toEqual({ isAuthenticated: false });
    expect(childProcessMocks.execFile).toHaveBeenCalledWith(
      '/mock/codex',
      ['login', 'status'],
      expect.objectContaining({
        env: { PATH: '/mock/bin' },
      }),
      expect.any(Function),
    );
  });

  it('treats the mock provider as ready', async () => {
    vi.stubEnv('OPEN_PREP_AI_PROVIDER', 'mock');

    const service = new CodexReadinessService();

    await expect(service.signIn()).resolves.toEqual({ isAuthenticated: true });
    expect(childProcessMocks.execFile).not.toHaveBeenCalled();
  });

  it('marks Codex authenticated after a successful CLI login', async () => {
    const service = new CodexReadinessService();
    const status = await service.signIn();

    expect(status).toEqual({ isAuthenticated: true });
    await expect(service.getStatus()).resolves.toEqual({ isAuthenticated: true });
    expect(childProcessMocks.execFile).toHaveBeenNthCalledWith(
      1,
      '/mock/codex',
      ['login'],
      expect.objectContaining({
        env: { PATH: '/mock/bin' },
      }),
      expect.any(Function),
    );
  });

  it('keeps Codex unauthenticated when CLI login fails', async () => {
    mockFailedCodexCommand('not signed in');

    const service = new CodexReadinessService();

    await expect(service.signIn()).rejects.toThrow('not signed in');
    mockFailedCodexCommand('Not logged in');
    await expect(service.getStatus()).resolves.toEqual({ isAuthenticated: false });
  });

  it('aborts CLI login when the Codex timeout elapses', async () => {
    vi.stubEnv('OPEN_PREP_CODEX_TIMEOUT_MS', '1');
    childProcessMocks.execFile.mockImplementation(
      (
        _command: string,
        _args: string[],
        options: { signal: AbortSignal },
        callback: ExecFileCallback,
      ) => {
        options.signal.addEventListener('abort', () => {
          callback(new Error('aborted'), '', 'aborted');
        });
      },
    );

    const service = new CodexReadinessService();
    const signIn = service.signIn();

    await expect(signIn).rejects.toThrow('ChatGPT sign-in check timed out after 1ms.');
  });
});
