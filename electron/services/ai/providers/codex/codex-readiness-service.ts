import { execFile, type ExecFileException } from 'node:child_process';

import { resolveCodexTimeoutMs } from './codex-provider';
import { resolveCodexCliProcessConfig } from './codex-sdk';

const CODEX_LOGIN_STATUS_TIMEOUT_MS = 10_000;

export type CodexAuthStatus = {
  isAuthenticated: boolean;
};

const runCodexCli = async (args: string[], timeoutMs: number): Promise<string> => {
  const { command, argsPrefix, env } = resolveCodexCliProcessConfig();
  const abortController = new AbortController();
  let didTimeOut = false;
  const timeout = setTimeout(() => {
    didTimeOut = true;
    abortController.abort();
  }, timeoutMs);

  try {
    return await new Promise<string>((resolve, reject) => {
      execFile(
        command,
        [...argsPrefix, ...args],
        {
          env: env as NodeJS.ProcessEnv,
          signal: abortController.signal,
          timeout: timeoutMs,
        },
        (error: ExecFileException | null, stdout: string | Buffer, stderr: string | Buffer) => {
          if (didTimeOut) {
            reject(new Error(`Codex command timed out after ${String(timeoutMs)}ms.`));
            return;
          }

          if (error) {
            reject(error);
            return;
          }

          resolve(`${String(stdout)}${String(stderr)}`);
        },
      );
    });
  } finally {
    clearTimeout(timeout);
  }
};

export class CodexReadinessService {
  private isAuthenticated = process.env.OPEN_PREP_AI_PROVIDER === 'mock';

  public async getStatus(): Promise<CodexAuthStatus> {
    if (process.env.OPEN_PREP_AI_PROVIDER === 'mock') {
      this.isAuthenticated = true;
      return {
        isAuthenticated: this.isAuthenticated,
      };
    }

    try {
      await runCodexCli(['login', 'status'], CODEX_LOGIN_STATUS_TIMEOUT_MS);
      this.isAuthenticated = true;
    } catch {
      this.isAuthenticated = false;
    }

    return {
      isAuthenticated: this.isAuthenticated,
    };
  }

  public async signIn(): Promise<CodexAuthStatus> {
    if (process.env.OPEN_PREP_AI_PROVIDER === 'mock') {
      this.isAuthenticated = true;
      return this.getStatus();
    }

    const timeoutMs = resolveCodexTimeoutMs();

    try {
      await runCodexCli(['login'], timeoutMs);
      this.isAuthenticated = true;

      return await this.getStatus();
    } catch (error) {
      this.isAuthenticated = false;

      if (error instanceof Error && error.message.includes('timed out')) {
        throw new Error(`ChatGPT sign-in check timed out after ${String(timeoutMs)}ms.`);
      }

      throw error;
    }
  }
}
