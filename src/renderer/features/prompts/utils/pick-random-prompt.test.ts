import { describe, expect, it } from 'vitest';

import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

import { pickRandomPrompt } from './pick-random-prompt';

const prompts: PromptSummary[] = [
  {
    id: 'first-prompt',
    title: 'First prompt',
    category: 'Integrated writing',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
  {
    id: 'second-prompt',
    title: 'Second prompt',
    category: 'Integrated writing',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
  {
    id: 'third-prompt',
    title: 'Third prompt',
    category: 'Integrated writing',
    examType: 'toefl',
    sectionType: 'writing',
    lastScore: null,
    lastCompletedAt: null,
  },
];

describe('pickRandomPrompt', () => {
  it('returns null when there are no prompts', () => {
    expect(pickRandomPrompt([], 0.5)).toBeNull();
  });

  it('picks the matching prompt for the provided random value', () => {
    expect(pickRandomPrompt(prompts, 0)?.id).toBe('first-prompt');
    expect(pickRandomPrompt(prompts, 0.5)?.id).toBe('second-prompt');
    expect(pickRandomPrompt(prompts, 0.999999)?.id).toBe('third-prompt');
  });

  it('clamps out-of-range random values', () => {
    expect(pickRandomPrompt(prompts, -1)?.id).toBe('first-prompt');
    expect(pickRandomPrompt(prompts, 1)?.id).toBe('third-prompt');
  });
});
