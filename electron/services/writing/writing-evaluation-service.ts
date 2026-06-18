import type {
  SubmitWritingAttemptInput,
  WritingAttemptDetails,
} from '../../../src/shared/domain/evaluations/evaluation-types';

import { createAiProvider } from '../ai/core/ai-provider-factory';
import type { PromptCatalogService } from '../catalog/prompt-catalog-service';
import type { AttemptRepository } from '../persistence/attempt-repository';

export class WritingEvaluationService {
  public constructor(
    private readonly promptCatalogService: PromptCatalogService,
    private readonly attemptRepository: AttemptRepository,
  ) {}

  public async submitAttempt(input: SubmitWritingAttemptInput): Promise<WritingAttemptDetails> {
    const prompt = this.promptCatalogService.getPromptDetails(input.promptId);
    const provider = createAiProvider(input.providerId);
    const pendingAttempt = this.attemptRepository.createAttempt(input, provider.id);

    try {
      const evaluation = await provider.evaluateWriting({
        prompt,
        essayText: input.essayText,
      });

      return this.attemptRepository.completeAttempt(pendingAttempt.id, evaluation);
    } catch (error) {
      this.attemptRepository.markAttemptFailed(pendingAttempt.id);
      throw error;
    }
  }
}
