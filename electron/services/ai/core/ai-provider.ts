import type { AiProviderType } from '../../../../src/shared/domain/ai/provider-types';
import type { WritingEvaluation } from '../../../../src/shared/domain/evaluations/evaluation-types';
import type { PromptDetails } from '../../../../src/shared/domain/prompts/prompt-types';

export type WritingEvaluationRequest = {
  prompt: PromptDetails;
  essayText: string;
};

export interface AiProvider {
  readonly id: AiProviderType;
  evaluateWriting(request: WritingEvaluationRequest): Promise<WritingEvaluation>;
}
