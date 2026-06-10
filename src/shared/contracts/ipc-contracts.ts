import type { WritingAttemptDetails, SubmitWritingAttemptInput } from '../domain/evaluations/evaluation-types';
import type { PromptDetails, PromptSummary } from '../domain/prompts/prompt-types';

export type CodexAuthStatus = {
  isAuthenticated: boolean;
};

export type OpenPrepApi = {
  getCodexAuthStatus: () => Promise<CodexAuthStatus>;
  signInWithChatGpt: () => Promise<CodexAuthStatus>;
  listPromptCatalog: () => Promise<PromptSummary[]>;
  getPromptDetails: (promptId: string) => Promise<PromptDetails>;
  submitWritingAttempt: (input: SubmitWritingAttemptInput) => Promise<WritingAttemptDetails>;
  getAttemptDetails: (attemptId: string) => Promise<WritingAttemptDetails>;
};
