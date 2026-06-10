import { Codex } from '@openai/codex-sdk';

import { resolveCodexTimeoutMs } from './codex-provider';

const CODEX_MODEL = 'gpt-5.4-mini';
const CODEX_REASONING_EFFORT = 'low';

export type CodexAuthStatus = {
  isAuthenticated: boolean;
};

export class CodexReadinessService {
  private isAuthenticated = process.env.OPEN_PREP_AI_PROVIDER === 'mock';

  public getStatus(): CodexAuthStatus {
    return {
      isAuthenticated: this.isAuthenticated,
    };
  }

  public async signIn(): Promise<CodexAuthStatus> {
    if (process.env.OPEN_PREP_AI_PROVIDER === 'mock') {
      this.isAuthenticated = true;
      return this.getStatus();
    }

    const codex = new Codex();
    const thread = codex.startThread({
      model: CODEX_MODEL,
      modelReasoningEffort: CODEX_REASONING_EFFORT,
      skipGitRepoCheck: true,
    });
    const timeoutMs = resolveCodexTimeoutMs();
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      await thread.run('Return JSON with ok set to true.', {
        outputSchema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean' },
          },
          required: ['ok'],
        },
        signal: abortController.signal,
      });
      this.isAuthenticated = true;

      return this.getStatus();
    } catch (error) {
      this.isAuthenticated = false;

      if (abortController.signal.aborted) {
        throw new Error(`ChatGPT sign-in check timed out after ${String(timeoutMs)}ms.`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
