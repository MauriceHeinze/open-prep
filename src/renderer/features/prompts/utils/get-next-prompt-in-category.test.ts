import { describe, expect, it } from 'vitest';

import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

import { getNextPromptInCategory } from './get-next-prompt-in-category';

const prompts: PromptSummary[] = [
  {
    id: 'email-1',
    title: 'Email 1',
    category: 'Email',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
  {
    id: 'academic-1',
    title: 'Academic 1',
    category: 'Academic Discussion Question',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
  {
    id: 'email-2',
    title: 'Email 2',
    category: 'Email',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
  {
    id: 'academic-2',
    title: 'Academic 2',
    category: 'Academic Discussion Question',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
];

describe('getNextPromptInCategory', () => {
  it('returns the next prompt in the same category', () => {
    expect(getNextPromptInCategory(prompts, 'email-1', 'Email')?.id).toBe('email-2');
  });

  it('wraps to the first prompt in the category when reaching the end', () => {
    expect(getNextPromptInCategory(prompts, 'academic-2', 'Academic Discussion Question')?.id).toBe(
      'academic-1',
    );
  });

  it('returns null when there is no other prompt in the category', () => {
    expect(getNextPromptInCategory(prompts, 'email-1', 'Missing category')).toBeNull();
    expect(
      getNextPromptInCategory(
        [
          {
            id: 'single',
            title: 'Single',
            category: 'Email',
            examType: 'toefl',
            sectionType: 'writing',
            lastScore: null,
            lastCompletedAt: null,
          },
        ],
        'single',
        'Email',
      ),
    ).toBeNull();
  });
});
