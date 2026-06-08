import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

export const pickRandomPrompt = (
  prompts: PromptSummary[],
  randomValue: number = Math.random(),
): PromptSummary | null => {
  if (prompts.length === 0) {
    return null;
  }

  const safeRandomValue = Math.min(Math.max(randomValue, 0), 0.9999999999999999);
  const promptIndex = Math.floor(safeRandomValue * prompts.length);

  return prompts[promptIndex] ?? null;
};
