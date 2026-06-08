import type {
  SubmitWritingAttemptInput,
  WritingAttemptDetails,
} from '../../../src/shared/domain/evaluations/evaluation-types';

import { createAiProvider } from '../ai/core/ai-provider-factory';
import type { PromptCatalogService } from '../catalog/prompt-catalog-service';
import type { AttemptRepository } from '../persistence/attempt-repository';

export class WritingEvaluationService {
  private readonly provider = createAiProvider();

  public constructor(
    private readonly promptCatalogService: PromptCatalogService,
    private readonly attemptRepository: AttemptRepository,
  ) {}

  public async submitAttempt(input: SubmitWritingAttemptInput): Promise<WritingAttemptDetails> {
    const prompt = this.promptCatalogService.getPromptDetails(input.promptId);
    const pendingAttempt = this.attemptRepository.createAttempt(input, this.provider.id);

    try {
      const evaluation = await this.provider.evaluateWriting({
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
