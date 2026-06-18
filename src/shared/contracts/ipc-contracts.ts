import type { WritingAttemptDetails, SubmitWritingAttemptInput } from '../domain/evaluations/evaluation-types';
import type {
  AiToolAuthStatus,
  AiToolSummary,
  StartAiToolAuthInput,
} from '../domain/ai/ai-tool-types';
import type { SwitchboardProviderType } from '../domain/ai/provider-types';
import type { PromptDetails, PromptSummary } from '../domain/prompts/prompt-types';

export type OpenPrepApi = {
  listAiTools: () => Promise<AiToolSummary[]>;
  getAiToolAuthStatus: (providerId: SwitchboardProviderType) => Promise<AiToolAuthStatus>;
  startAiToolAuth: (input: StartAiToolAuthInput) => Promise<AiToolAuthStatus>;
  listPromptCatalog: () => Promise<PromptSummary[]>;
  getPromptDetails: (promptId: string) => Promise<PromptDetails>;
  submitWritingAttempt: (input: SubmitWritingAttemptInput) => Promise<WritingAttemptDetails>;
  getAttemptDetails: (attemptId: string) => Promise<WritingAttemptDetails>;
};
