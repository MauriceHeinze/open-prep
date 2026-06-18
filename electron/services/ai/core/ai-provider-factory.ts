import type { AiProvider } from './ai-provider';
import type { AiProviderType } from '../../../../src/shared/domain/ai/provider-types';

import { MockProvider } from '../providers/mock/mock-provider';
import { SwitchboardProvider } from '../providers/switchboard/switchboard-provider';

export const createAiProvider = (providerId: AiProviderType): AiProvider => {
  if (providerId === 'mock' || process.env.OPEN_PREP_AI_PROVIDER === 'mock') {
    return new MockProvider();
  }

  return new SwitchboardProvider(providerId);
};
