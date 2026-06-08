import type { AiProvider } from './ai-provider';

import { CodexProvider } from '../providers/codex/codex-provider';
import { MockProvider } from '../providers/mock/mock-provider';

export const createAiProvider = (): AiProvider => {
  const provider = process.env.OPEN_PREP_AI_PROVIDER;

  if (provider === 'mock') {
    return new MockProvider();
  }

  return new CodexProvider();
};
