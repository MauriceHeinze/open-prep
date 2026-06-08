import { describe, expect, it } from 'vitest';

import { loadWritingPromptsFromFiles } from './writing-prompt-loader';

describe('loadWritingPromptsFromFiles', () => {
  it('loads the current writing prompt catalog from disk', () => {
    const prompts = loadWritingPromptsFromFiles();

    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts.some((prompt) => prompt.promptType === 'email')).toBe(true);
    expect(prompts.some((prompt) => prompt.promptType === 'academic-discussion')).toBe(true);

    const emailPrompt = prompts.find((prompt) => prompt.id === 'wrong-headphones-delivered');

    expect(emailPrompt).toMatchObject({
      category: 'Email',
      promptType: 'email',
      question: '',
      passage: '',
    });
    expect(emailPrompt?.instructions).toContain('Write an email');
    expect(emailPrompt?.discussionParticipants).toEqual([]);

    const discussionPrompt = prompts.find(
      (prompt) => prompt.id === 'targeted-advertising-ethics',
    );

    expect(discussionPrompt?.promptType).toBe('academic-discussion');
    expect(discussionPrompt?.discussionParticipants).toHaveLength(3);
    expect(
      discussionPrompt?.discussionParticipants.every((participant) =>
        participant.avatarUrl.startsWith('/avatars/uifaces/'),
      ),
    ).toBe(true);
  });
});
