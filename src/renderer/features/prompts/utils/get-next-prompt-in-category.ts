import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

export const getNextPromptInCategory = (
  prompts: PromptSummary[],
  currentPromptId: string,
  category: string,
): PromptSummary | null => {
  const promptsInCategory = prompts.filter((prompt) => prompt.category === category);

  if (promptsInCategory.length <= 1) {
    return null;
  }

  const currentPromptIndex = promptsInCategory.findIndex((prompt) => prompt.id === currentPromptId);

  if (currentPromptIndex === -1) {
    return promptsInCategory[0] ?? null;
  }

  const nextPromptIndex = (currentPromptIndex + 1) % promptsInCategory.length;

  return promptsInCategory[nextPromptIndex] ?? null;
};
