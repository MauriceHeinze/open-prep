import * as v from 'valibot';

import { aiProviderTypeSchema, examTypeSchema, sectionTypeSchema } from './common-schemas';

const promptTypeSchema = v.picklist(['academic-discussion', 'email', 'legacy']);

const promptDiscussionParticipantSchema = v.object({
  role: v.picklist(['professor', 'student']),
  name: v.string(),
  gender: v.picklist(['female', 'male']),
  avatarUrl: v.string(),
  message: v.string(),
});

export const promptSummarySchema = v.object({
  id: v.string(),
  title: v.string(),
  category: v.string(),
  examType: examTypeSchema,
  sectionType: sectionTypeSchema,
  lastScore: v.nullable(v.number()),
  lastCompletedAt: v.nullable(v.string()),
});

export const promptDetailsSchema = v.object({
  ...promptSummarySchema.entries,
  promptType: promptTypeSchema,
  scenario: v.string(),
  discussionParticipants: v.array(promptDiscussionParticipantSchema),
  instructions: v.string(),
  question: v.string(),
  passage: v.string(),
  recommendedWordCount: v.string(),
});

const storedPromptBaseSchema = {
  id: v.string(),
  title: v.string(),
  category: v.string(),
  examType: examTypeSchema,
  sectionType: sectionTypeSchema,
};

export const legacyStoredPromptSchema = v.object({
  ...storedPromptBaseSchema,
  type: v.optional(promptTypeSchema, 'legacy'),
  instructions: v.string(),
  question: v.string(),
  passage: v.string(),
  recommendedWordCount: v.string(),
});

export const scenarioStoredPromptSchema = v.object({
  ...storedPromptBaseSchema,
  type: v.picklist(['academic-discussion', 'email']),
  scenario: v.string(),
  discussion: v.optional(
    v.object({
      professor: v.string(),
      studentA: v.string(),
      studentB: v.string(),
    }),
  ),
});

export const storedPromptFileSchema = v.array(
  v.union([legacyStoredPromptSchema, scenarioStoredPromptSchema]),
);

export const submitWritingAttemptInputSchema = v.object({
  promptId: v.string(),
  essayText: v.pipe(v.string(), v.minLength(50)),
});

export const providerConfigSchema = v.object({
  providerType: aiProviderTypeSchema,
});
