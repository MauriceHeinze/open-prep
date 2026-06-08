import { describe, expect, it } from 'vitest';

import type { WritingFeedbackHighlight } from '@shared/domain/writing/writing-types';

import { compareHighlightsByResolvedBounds, resolveHighlightBounds } from './highlight-bounds';

const buildHighlight = (
  overrides: Partial<WritingFeedbackHighlight>,
): WritingFeedbackHighlight => ({
  id: 'highlight-1',
  excerpt: 'fedback',
  replacement: 'feedback',
  category: 'grammar-spelling',
  explanation: 'This word is misspelled.',
  alternatives: [],
  startOffset: 0,
  endOffset: 0,
  ...overrides,
});

describe('resolveHighlightBounds', () => {
  it('uses valid offsets when they point at the excerpt', () => {
    const essayText = 'This can make feedback faster.';
    const startOffset = essayText.indexOf('feedback');

    expect(
      resolveHighlightBounds(
        essayText,
        buildHighlight({
          excerpt: 'feedback',
          startOffset,
          endOffset: startOffset + 'feedback'.length,
        }),
      ),
    ).toEqual({ start: startOffset, end: startOffset + 'feedback'.length });
  });

  it('falls back to the excerpt when offsets point at nearby unrelated text', () => {
    const essayText = 'In my opinion, the bes fedback solution is not to ban AI.';
    const wrongStartOffset = essayText.indexOf('the bes');
    const excerptStart = essayText.indexOf('fedback');

    expect(
      resolveHighlightBounds(
        essayText,
        buildHighlight({
          startOffset: wrongStartOffset,
          endOffset: wrongStartOffset + 'the bes'.length,
        }),
      ),
    ).toEqual({ start: excerptStart, end: excerptStart + 'fedback'.length });
  });

  it('expands partial-token offsets when the excerpt includes the full token', () => {
    const essayText = 'AI can help students understands difficult topics.';
    const partialStartOffset = essayText.indexOf('understand');
    const excerptStart = essayText.indexOf('understands');

    expect(
      resolveHighlightBounds(
        essayText,
        buildHighlight({
          excerpt: 'understands',
          replacement: 'understand',
          startOffset: partialStartOffset,
          endOffset: partialStartOffset + 'understand'.length,
        }),
      ),
    ).toEqual({ start: excerptStart, end: excerptStart + 'understands'.length });
  });

  it('chooses the matching excerpt closest to the supplied offset', () => {
    const essayText = 'feedback is useful, but fedback is misspelled.';
    const excerptStart = essayText.indexOf('fedback');

    expect(
      resolveHighlightBounds(
        essayText,
        buildHighlight({
          startOffset: excerptStart + 2,
          endOffset: excerptStart + 6,
        }),
      ),
    ).toEqual({ start: excerptStart, end: excerptStart + 'fedback'.length });
  });
});

describe('compareHighlightsByResolvedBounds', () => {
  it('sorts by resolved excerpt position instead of stale raw offsets', () => {
    const essayText = 'First fedback. Then understand.';
    const feedbackStart = essayText.indexOf('fedback');
    const understandStart = essayText.indexOf('understand');
    const highlights = [
      buildHighlight({
        id: 'understand',
        excerpt: 'understand',
        replacement: 'understands',
        startOffset: 0,
        endOffset: 'First'.length,
      }),
      buildHighlight({
        id: 'feedback',
        startOffset: understandStart,
        endOffset: understandStart + 'understand'.length,
      }),
    ];

    expect(highlights.sort(compareHighlightsByResolvedBounds(essayText)).map(({ id }) => id))
      .toEqual(['feedback', 'understand']);
    expect(resolveHighlightBounds(essayText, highlights[0])).toEqual({
      start: feedbackStart,
      end: feedbackStart + 'fedback'.length,
    });
  });
});
