import type { WritingAttemptDetails, SubmitWritingAttemptInput } from '../domain/evaluations/evaluation-types';
import type { PromptDetails, PromptSummary } from '../domain/prompts/prompt-types';

export type OpenPrepApi = {
  listPromptCatalog: () => Promise<PromptSummary[]>;
  getPromptDetails: (promptId: string) => Promise<PromptDetails>;
  submitWritingAttempt: (input: SubmitWritingAttemptInput) => Promise<WritingAttemptDetails>;
  getAttemptDetails: (attemptId: string) => Promise<WritingAttemptDetails>;
};
