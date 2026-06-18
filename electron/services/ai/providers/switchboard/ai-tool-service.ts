import { connect, discover, type ProviderId } from 'switchboard-ai-sdk';

import type {
  AiToolAuthStatus,
  AiToolSummary,
} from '../../../../../src/shared/domain/ai/ai-tool-types';
import type { SwitchboardProviderType } from '../../../../../src/shared/domain/ai/provider-types';

const AUTH_STATUS_TIMEOUT_MS = 10_000;

type ToolAuthCheckResult = {
  authSupported: boolean;
  authenticated: boolean | null;
  authStatus: 'authenticated' | 'unauthenticated' | 'not_supported' | 'unknown';
  reason?: string;
  output?: string;
};

const mockAuthStatus: AiToolAuthStatus = {
  authSupported: true,
  isAuthenticated: true,
  status: 'authenticated',
};

const unavailableAuthStatus: AiToolAuthStatus = {
  authSupported: false,
  isAuthenticated: false,
  status: 'unknown',
  message: 'Not detected on your device.',
};

const createMockTool = (
  id: SwitchboardProviderType,
  name: string,
  available = true,
): AiToolSummary => ({
  id,
  name,
  type: 'agent',
  available,
  capabilities: available ? ['chat'] : [],
  models: [],
  defaultModel: null,
  authStatus: available ? mockAuthStatus : unavailableAuthStatus,
});

const resolveAuthTimeoutMs = (): number => {
  const configuredTimeoutMs = Number(process.env.OPEN_PREP_AI_TIMEOUT_MS);

  return Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0
    ? configuredTimeoutMs
    : 300_000;
};

const toAiToolAuthStatus = (status: ToolAuthCheckResult): AiToolAuthStatus => ({
  authSupported: status.authSupported,
  isAuthenticated: status.authenticated === true || status.authStatus === 'not_supported',
  status: status.authStatus,
  message: status.reason,
  instructions: status.output,
});

const toUnknownAuthStatus = (error: unknown): AiToolAuthStatus => ({
  authSupported: true,
  isAuthenticated: false,
  status: 'unknown',
  message: error instanceof Error ? error.message : 'Authentication status could not be checked.',
});

export class AiToolService {
  public async listTools(): Promise<AiToolSummary[]> {
    if (process.env.OPEN_PREP_AI_PROVIDER === 'mock') {
      return [
        createMockTool('claude-code', 'Claude Code', false),
        createMockTool('codex', 'Codex'),
        createMockTool('opencode', 'OpenCode'),
        createMockTool('ollama', 'Ollama'),
      ];
    }

    const tools = await discover();
    const summaries = await Promise.all(
      tools.map(async (tool): Promise<AiToolSummary> => ({
        id: tool.id,
        name: tool.name,
        type: tool.type,
        available: tool.available,
        capabilities: tool.capabilities,
        models: tool.models ?? [],
        defaultModel: tool.defaultModel ?? null,
        authStatus: tool.available
          ? await this.getAuthStatus(tool.id).catch(toUnknownAuthStatus)
          : {
            authSupported: false,
            isAuthenticated: false,
            status: 'unknown',
            message: typeof tool.metadata?.reason === 'string'
              ? tool.metadata.reason
              : 'Tool is not available on this device.',
          },
        metadata: tool.metadata,
      })),
    );

    return summaries;
  }

  public async getAuthStatus(providerId: SwitchboardProviderType): Promise<AiToolAuthStatus> {
    const tool = await connect(providerId as ProviderId);

    if (!tool.checkAuth) {
      return {
        authSupported: false,
        isAuthenticated: true,
        status: 'not_supported',
      };
    }

    return toAiToolAuthStatus(await tool.checkAuth({ timeoutMs: AUTH_STATUS_TIMEOUT_MS }));
  }

  public async startAuth(providerId: SwitchboardProviderType): Promise<AiToolAuthStatus> {
    const tool = await connect(providerId as ProviderId);

    if (!tool.startAuth) {
      return {
        authSupported: false,
        isAuthenticated: true,
        status: 'not_supported',
      };
    }

    const result = await tool.startAuth({ timeoutMs: resolveAuthTimeoutMs() });

    if (result.authenticated === true || result.status === 'already_authenticated') {
      return {
        authSupported: true,
        isAuthenticated: true,
        status: 'authenticated',
        message: result.message,
        instructions: result.instructions ?? result.output,
      };
    }

    if (result.status === 'started') {
      return {
        authSupported: true,
        isAuthenticated: false,
        status: 'unknown',
        message: result.message,
        instructions: result.instructions ?? result.output,
      };
    }

    if (result.status === 'unsupported') {
      return {
        authSupported: false,
        isAuthenticated: true,
        status: 'not_supported',
        message: result.message,
      };
    }

    return {
      authSupported: true,
      isAuthenticated: false,
      status: 'unauthenticated',
      message: result.message,
      instructions: result.instructions ?? result.output,
    };
  }
}
