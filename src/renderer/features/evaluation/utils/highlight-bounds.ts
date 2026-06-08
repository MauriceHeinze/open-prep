import type { WritingFeedbackHighlight } from '@shared/domain/writing/writing-types';

export type HighlightBounds = {
  start: number;
  end: number;
};

const clampOffset = (offset: number, textLength: number): number =>
  Math.max(0, Math.min(offset, textLength));

const findClosestExcerptBounds = (
  essayText: string,
  excerpt: string,
  preferredStart: number,
): HighlightBounds | null => {
  if (excerpt.length === 0) {
    return null;
  }

  let bestBounds: HighlightBounds | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  let searchStart = 0;

  while (searchStart <= essayText.length) {
    const excerptStart = essayText.indexOf(excerpt, searchStart);

    if (excerptStart === -1) {
      break;
    }

    const distance = Math.abs(excerptStart - preferredStart);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestBounds = {
        start: excerptStart,
        end: excerptStart + excerpt.length,
      };
    }

    searchStart = excerptStart + Math.max(excerpt.length, 1);
  }

  return bestBounds;
};

export const resolveHighlightBounds = (
  essayText: string,
  highlight: WritingFeedbackHighlight,
): HighlightBounds | null => {
  const startOffset = clampOffset(highlight.startOffset, essayText.length);
  const endOffset = Math.max(startOffset, clampOffset(highlight.endOffset, essayText.length));
  const offsetText = essayText.slice(startOffset, endOffset);

  if (highlight.excerpt.length > 0 && offsetText === highlight.excerpt) {
    return { start: startOffset, end: endOffset };
  }

  const closestExcerptBounds = findClosestExcerptBounds(
    essayText,
    highlight.excerpt,
    startOffset,
  );

  if (closestExcerptBounds) {
    return closestExcerptBounds;
  }

  if (endOffset > startOffset) {
    return { start: startOffset, end: endOffset };
  }

  return null;
};

export const compareHighlightsByResolvedBounds =
  (essayText: string) =>
  (first: WritingFeedbackHighlight, second: WritingFeedbackHighlight): number => {
    const firstBounds = resolveHighlightBounds(essayText, first);
    const secondBounds = resolveHighlightBounds(essayText, second);

    return (
      (firstBounds?.start ?? first.startOffset) - (secondBounds?.start ?? second.startOffset)
    );
  };
