import type { AiProviderType } from '../ai/provider-types';
import type { PromptDetails } from '../prompts/prompt-types';
import type { WritingCriterionScore, WritingFeedbackHighlight } from '../writing/writing-types';

export type AttemptStatus = 'pending' | 'completed' | 'failed';

export type WritingEvaluation = {
  overallScore: number;
  overallMaxScore: number;
  summary: string;
  nextStep: string;
  criterionScores: WritingCriterionScore[];
  highlights: WritingFeedbackHighlight[];
};

export type WritingAttemptDetails = {
  id: string;
  prompt: PromptDetails;
  essayText: string;
  submittedAt: string;
  providerType: AiProviderType;
  status: AttemptStatus;
  evaluation: WritingEvaluation | null;
};

export type SubmitWritingAttemptInput = {
  promptId: string;
  essayText: string;
  providerId: AiProviderType;
};
