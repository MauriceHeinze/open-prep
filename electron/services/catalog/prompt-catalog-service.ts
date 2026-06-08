import type { PromptDetails, PromptSummary } from '../../../src/shared/domain/prompts/prompt-types';

import type { AttemptRepository } from '../persistence/attempt-repository';

export class PromptCatalogService {
  public constructor(private readonly attemptRepository: AttemptRepository) {}

  public listPromptCatalog(): PromptSummary[] {
    return this.attemptRepository.listPromptSummaries();
  }

  public getPromptDetails(promptId: string): PromptDetails {
    return this.attemptRepository.getPromptDetails(promptId);
  }
}
