import type { AiProviderType, SwitchboardProviderType } from './provider-types';

export type AiToolAuthStatus = {
  authSupported: boolean;
  isAuthenticated: boolean;
  status: 'authenticated' | 'unauthenticated' | 'not_supported' | 'unknown';
  message?: string;
  instructions?: string;
};

export type AiToolSummary = {
  id: AiProviderType;
  name: string;
  type: 'agent' | 'runtime' | 'server' | 'unknown';
  available: boolean;
  capabilities: string[];
  models: string[];
  defaultModel: string | null;
  authStatus: AiToolAuthStatus;
  metadata?: Record<string, unknown>;
};

export type StartAiToolAuthInput = {
  providerId: SwitchboardProviderType;
};
