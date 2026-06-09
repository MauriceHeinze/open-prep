import { describe, expect, it } from 'vitest';

import { normalizeEvaluationPayload } from './codex-provider';

const baseEvaluation = {
  overallScore: 4,
  overallMaxScore: 6,
  summary: 'Clear response with room for more precise phrasing.',
  nextStep: 'Add a concrete example and tighten one informal phrase.',
  criterionScores: [
    {
      criterion: 'organization',
      label: 'Organization',
      score: 4,
      maxScore: 5,
      comment: 'The response is easy to follow.',
    },
  ],
};

describe('normalizeEvaluationPayload', () => {
  it('derives missing highlight offsets from the submitted essay', () => {
    const result = normalizeEvaluationPayload(
      {
        ...baseEvaluation,
        highlights: [
          {
            id: 'highlight-1',
            excerpt: 'a lot good',
            replacement: 'very beneficial',
            category: 'idiomatic-word-choice',
            explanation: 'This sounds more academic.',
          },
        ],
      },
      'Remote work is a lot good for many employees.',
    ) as { highlights: Array<{ startOffset: number; endOffset: number; alternatives: string[] }> };

    expect(result.highlights[0]?.startOffset).toBe(15);
    expect(result.highlights[0]?.endOffset).toBe(25);
    expect(result.highlights[0]?.alternatives).toEqual([]);
  });

  it('drops malformed highlights that cannot be located in the essay', () => {
    const result = normalizeEvaluationPayload(
      {
        ...baseEvaluation,
        highlights: [
          {
            id: 'highlight-1',
            excerpt: 'not in the essay',
            replacement: 'more precise wording',
            category: 'idiomatic-word-choice',
            explanation: 'This sounds more academic.',
          },
        ],
      },
      'Remote work is useful for many employees.',
    ) as { highlights: unknown[] };

    expect(result.highlights).toEqual([]);
  });
});
