import { describe, expect, it } from 'vitest';
import * as v from 'valibot';

import { writingEvaluationSchema } from './evaluation-schemas';

describe('writingEvaluationSchema', () => {
  it('parses a valid writing evaluation payload', () => {
    const result = v.parse(writingEvaluationSchema, {
      overallScore: 4,
      overallMaxScore: 6,
      summary: 'Clear overall structure with room for more precise vocabulary.',
      nextStep: 'Add a more specific example and tighten academic phrasing.',
      criterionScores: [
        {
          criterion: 'organization',
          label: 'Organization',
          score: 5,
          maxScore: 5,
          comment: 'Logical and easy to follow.',
        },
        {
          criterion: 'grammarAndMechanics',
          label: 'Grammar & Mechanics',
          score: 4,
          maxScore: 5,
          comment: 'Mostly correct with minor slips.',
        },
        {
          criterion: 'languageAccuracy',
          label: 'Language Accuracy',
          score: 3,
          maxScore: 5,
          comment: 'Vocabulary range is somewhat limited.',
        },
        {
          criterion: 'developmentAndSupport',
          label: 'Development & Support',
          score: 3,
          maxScore: 5,
          comment: 'Support exists but could be more concrete.',
        },
      ],
      highlights: [
        {
          id: 'highlight-1',
          excerpt: 'pretty',
          replacement: 'particularly',
          category: 'idiomatic-word-choice',
          explanation: 'The replacement sounds more academic.',
          alternatives: ['particularly', 'notably'],
          startOffset: 12,
          endOffset: 18,
        },
      ],
    });

    expect(result.overallScore).toBe(4);
    expect(result.highlights[0]?.replacement).toBe('particularly');
  });

  it('defaults missing highlight alternatives to an empty array', () => {
    const result = v.parse(writingEvaluationSchema, {
      overallScore: 4,
      overallMaxScore: 6,
      summary: 'Clear overall structure with room for more precise vocabulary.',
      nextStep: 'Add a more specific example and tighten academic phrasing.',
      criterionScores: [
        {
          criterion: 'organization',
          label: 'Organization',
          score: 5,
          maxScore: 5,
          comment: 'Logical and easy to follow.',
        },
      ],
      highlights: [
        {
          id: 'highlight-1',
          excerpt: 'pretty',
          replacement: 'particularly',
          category: 'idiomatic-word-choice',
          explanation: 'The replacement sounds more academic.',
          startOffset: 12,
          endOffset: 18,
        },
      ],
    });

    expect(result.highlights[0]?.alternatives).toEqual([]);
  });
});
