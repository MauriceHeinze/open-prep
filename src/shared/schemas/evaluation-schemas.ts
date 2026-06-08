import * as v from 'valibot';

import { aiProviderTypeSchema, writingCriterionKeySchema } from './common-schemas';
import { promptDetailsSchema } from './prompt-schemas';

export const writingCriterionScoreSchema = v.object({
  criterion: writingCriterionKeySchema,
  label: v.string(),
  score: v.pipe(v.number(), v.minValue(0), v.maxValue(5)),
  maxScore: v.pipe(v.number(), v.minValue(1), v.maxValue(5)),
  comment: v.string(),
});

export const writingHighlightSchema = v.object({
  id: v.string(),
  excerpt: v.string(),
  replacement: v.string(),
  category: v.picklist([
    'grammar-spelling',
    'relevance',
    'idiomatic-word-choice',
    'elaboration',
  ]),
  explanation: v.string(),
  alternatives: v.optional(v.array(v.string()), []),
  startOffset: v.pipe(v.number(), v.minValue(0)),
  endOffset: v.pipe(v.number(), v.minValue(0)),
});

export const writingEvaluationSchema = v.object({
  overallScore: v.pipe(v.number(), v.minValue(0), v.maxValue(6)),
  overallMaxScore: v.pipe(v.number(), v.minValue(1), v.maxValue(6)),
  summary: v.string(),
  nextStep: v.string(),
  criterionScores: v.array(writingCriterionScoreSchema),
  highlights: v.array(writingHighlightSchema),
});

export const writingAttemptDetailsSchema = v.object({
  id: v.string(),
  prompt: promptDetailsSchema,
  essayText: v.string(),
  submittedAt: v.string(),
  providerType: aiProviderTypeSchema,
  status: v.picklist(['pending', 'completed', 'failed']),
  evaluation: v.nullable(writingEvaluationSchema),
});
