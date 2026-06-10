export const writingEvaluationOutputSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    overallScore: { type: 'number', minimum: 0, maximum: 6 },
    overallMaxScore: { type: 'number', minimum: 1, maximum: 6 },
    summary: { type: 'string' },
    nextStep: { type: 'string' },
    criterionScores: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          criterion: {
            type: 'string',
            enum: [
              'organization',
              'grammarAndMechanics',
              'languageAccuracy',
              'developmentAndSupport',
            ],
          },
          label: { type: 'string' },
          score: { type: 'number', minimum: 0, maximum: 5 },
          maxScore: { type: 'number', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
        },
        required: ['criterion', 'label', 'score', 'maxScore', 'comment'],
      },
    },
    highlights: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          excerpt: { type: 'string' },
          replacement: { type: 'string' },
          category: {
            type: 'string',
            enum: ['grammar-spelling', 'relevance', 'idiomatic-word-choice', 'elaboration'],
          },
          explanation: { type: 'string' },
          alternatives: {
            type: 'array',
            items: { type: 'string' },
          },
          startOffset: { type: 'number', minimum: 0 },
          endOffset: { type: 'number', minimum: 0 },
        },
        required: [
          'id',
          'excerpt',
          'replacement',
          'category',
          'explanation',
          'alternatives',
          'startOffset',
          'endOffset',
        ],
      },
    },
  },
  required: [
    'overallScore',
    'overallMaxScore',
    'summary',
    'nextStep',
    'criterionScores',
    'highlights',
  ],
} as const;
