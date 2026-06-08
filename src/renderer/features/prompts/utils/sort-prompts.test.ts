import { describe, expect, it } from 'vitest';

import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

import { getNextPromptSortConfig, sortPrompts } from './sort-prompts';

const prompts: PromptSummary[] = [
  {
    id: 'hotel-facilities',
    title: 'Hotel Facilities',
    category: 'Independent',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
  {
    id: 'missed-a-quiz',
    title: 'Missed a Quiz',
    category: 'Integrated',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: 3,
    lastCompletedAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'essay-submission',
    title: 'Essay Submission',
    category: 'Academic',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: 5,
    lastCompletedAt: '2026-06-03T10:00:00.000Z',
  },
];

describe('sortPrompts', () => {
  it('uses the catalog order by default', () => {
    expect(sortPrompts(prompts, { key: 'default' }).map((prompt) => prompt.id)).toEqual([
      'missed-a-quiz',
      'essay-submission',
      'hotel-facilities',
    ]);
  });

  it('sorts titles ascending', () => {
    expect(
      sortPrompts(prompts, {
        key: 'title',
        direction: 'asc',
      }).map((prompt) => prompt.title),
    ).toEqual(['Essay Submission', 'Hotel Facilities', 'Missed a Quiz']);
  });

  it('sorts scores descending and keeps incomplete prompts at the end', () => {
    expect(
      sortPrompts(prompts, {
        key: 'lastScore',
        direction: 'desc',
      }).map((prompt) => prompt.id),
    ).toEqual(['essay-submission', 'missed-a-quiz', 'hotel-facilities']);
  });

  it('sorts completion dates ascending and keeps not-done prompts at the end', () => {
    expect(
      sortPrompts(prompts, {
        key: 'lastCompletedAt',
        direction: 'asc',
      }).map((prompt) => prompt.id),
    ).toEqual(['missed-a-quiz', 'essay-submission', 'hotel-facilities']);
  });
});

describe('getNextPromptSortConfig', () => {
  it('starts score and completion sorts in descending order', () => {
    expect(getNextPromptSortConfig({ key: 'default' }, 'lastScore')).toEqual({
      key: 'lastScore',
      direction: 'desc',
    });
    expect(getNextPromptSortConfig({ key: 'default' }, 'lastCompletedAt')).toEqual({
      key: 'lastCompletedAt',
      direction: 'desc',
    });
  });

  it('toggles the direction for the active key', () => {
    expect(
      getNextPromptSortConfig(
        {
          key: 'title',
          direction: 'asc',
        },
        'title',
      ),
    ).toEqual({
      key: 'title',
      direction: 'desc',
    });
  });
});
