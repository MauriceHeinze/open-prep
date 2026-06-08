import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

const promptCatalogOrder = [
  'missed-a-quiz',
  'more-information-from-speaker',
  'property-maintenance',
  'noisy-neighbors',
  'wrong-package',
  'essay-submission',
  'missing-a-meeting',
  'travel-planning',
  'the-wrong-jacket',
  'hotel-facilities',
  'library-hours',
] as const;

const promptRankById = new Map<string, number>(promptCatalogOrder.map((id, index) => [id, index]));

export type PromptSortKey = 'title' | 'category' | 'lastScore' | 'lastCompletedAt';
export type PromptSortDirection = 'asc' | 'desc';

export type PromptSortConfig =
  | {
      key: 'default';
    }
  | {
      key: PromptSortKey;
      direction: PromptSortDirection;
    };

const compareNullableNumbers = (
  firstValue: number | null,
  secondValue: number | null,
  direction: PromptSortDirection,
): number => {
  if (firstValue === secondValue) {
    return 0;
  }

  if (firstValue === null) {
    return 1;
  }

  if (secondValue === null) {
    return -1;
  }

  return direction === 'asc' ? firstValue - secondValue : secondValue - firstValue;
};

const compareNullableDates = (
  firstValue: string | null,
  secondValue: string | null,
  direction: PromptSortDirection,
): number => {
  if (firstValue === secondValue) {
    return 0;
  }

  if (firstValue === null) {
    return 1;
  }

  if (secondValue === null) {
    return -1;
  }

  const firstTime = new Date(firstValue).getTime();
  const secondTime = new Date(secondValue).getTime();

  return direction === 'asc' ? firstTime - secondTime : secondTime - firstTime;
};

const comparePromptNames = (firstPrompt: PromptSummary, secondPrompt: PromptSummary): number =>
  firstPrompt.title.localeCompare(secondPrompt.title);

export const getNextPromptSortConfig = (
  currentSort: PromptSortConfig,
  nextKey: PromptSortKey,
): PromptSortConfig => {
  if (currentSort.key === nextKey) {
    return {
      key: nextKey,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
    };
  }

  return {
    key: nextKey,
    direction: nextKey === 'lastScore' || nextKey === 'lastCompletedAt' ? 'desc' : 'asc',
  };
};

export const sortPrompts = (
  prompts: PromptSummary[],
  sortConfig: PromptSortConfig,
): PromptSummary[] => {
  const sortedPrompts = [...prompts];

  if (sortConfig.key === 'default') {
    return sortedPrompts.sort((firstPrompt, secondPrompt) => {
      const firstRank = promptRankById.get(firstPrompt.id) ?? Number.MAX_SAFE_INTEGER;
      const secondRank = promptRankById.get(secondPrompt.id) ?? Number.MAX_SAFE_INTEGER;

      if (firstRank !== secondRank) {
        return firstRank - secondRank;
      }

      return comparePromptNames(firstPrompt, secondPrompt);
    });
  }

  return sortedPrompts.sort((firstPrompt, secondPrompt) => {
    switch (sortConfig.key) {
      case 'title': {
        const titleComparison =
          sortConfig.direction === 'asc'
            ? firstPrompt.title.localeCompare(secondPrompt.title)
            : secondPrompt.title.localeCompare(firstPrompt.title);

        return titleComparison || firstPrompt.category.localeCompare(secondPrompt.category);
      }
      case 'category': {
        const categoryComparison =
          sortConfig.direction === 'asc'
            ? firstPrompt.category.localeCompare(secondPrompt.category)
            : secondPrompt.category.localeCompare(firstPrompt.category);

        return categoryComparison || comparePromptNames(firstPrompt, secondPrompt);
      }
      case 'lastScore': {
        return (
          compareNullableNumbers(firstPrompt.lastScore, secondPrompt.lastScore, sortConfig.direction) ||
          comparePromptNames(firstPrompt, secondPrompt)
        );
      }
      case 'lastCompletedAt': {
        return (
          compareNullableDates(
            firstPrompt.lastCompletedAt,
            secondPrompt.lastCompletedAt,
            sortConfig.direction,
          ) || comparePromptNames(firstPrompt, secondPrompt)
        );
      }
      default:
        return 0;
    }
  });
};
