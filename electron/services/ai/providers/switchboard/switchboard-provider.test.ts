import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PromptDetails } from '../../../../../src/shared/domain/prompts/prompt-types';

import { SwitchboardProvider, normalizeEvaluationPayload } from './switchboard-provider';

const switchboardMocks = vi.hoisted(() => ({
  chat: vi.fn(),
  connect: vi.fn(),
}));

vi.mock('switchboard-ai-sdk', () => ({
  connect: switchboardMocks.connect,
}));

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

const basePrompt: PromptDetails = {
  id: 'prompt-1',
  title: 'Remote work',
  category: 'Academic Discussion Question',
  examType: 'toefl',
  sectionType: 'writing',
  lastScore: null,
  lastCompletedAt: null,
  promptType: 'academic-discussion',
  scenario: 'Discuss whether remote work is useful.',
  discussionParticipants: [],
  instructions: 'Write a response.',
  question: 'Is remote work useful?',
  passage: '',
  recommendedWordCount: '100-120 words',
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

describe('SwitchboardProvider', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    switchboardMocks.connect.mockResolvedValue({
      chat: switchboardMocks.chat,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('evaluates writing through the selected Switchboard tool', async () => {
    switchboardMocks.chat.mockResolvedValue({
      message: {
        role: 'assistant',
        content: JSON.stringify({
          ...baseEvaluation,
          highlights: [],
        }),
      },
    });

    const provider = new SwitchboardProvider('opencode');
    const result = await provider.evaluateWriting({
      prompt: basePrompt,
      essayText: 'Remote work is useful for many employees.',
    });

    expect(result.summary).toBe(baseEvaluation.summary);
    expect(switchboardMocks.connect).toHaveBeenCalledWith('opencode');
    expect(switchboardMocks.chat).toHaveBeenCalledWith(
      {
        messages: [
          {
            role: 'user',
            content: expect.stringContaining('Student essay:'),
          },
        ],
      },
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        timeoutMs: 300_000,
      }),
    );
  });

  it('rejects malformed JSON returned by the tool', async () => {
    switchboardMocks.chat.mockResolvedValue({
      message: {
        role: 'assistant',
        content: 'not json',
      },
    });

    const provider = new SwitchboardProvider('codex');

    await expect(
      provider.evaluateWriting({
        prompt: basePrompt,
        essayText: 'Remote work is useful for many employees.',
      }),
    ).rejects.toThrow();
  });

  it('rejects invalid evaluation payloads returned by the tool', async () => {
    switchboardMocks.chat.mockResolvedValue({
      message: {
        role: 'assistant',
        content: JSON.stringify({
          ...baseEvaluation,
          overallScore: 99,
          highlights: [],
        }),
      },
    });

    const provider = new SwitchboardProvider('codex');

    await expect(
      provider.evaluateWriting({
        prompt: basePrompt,
        essayText: 'Remote work is useful for many employees.',
      }),
    ).rejects.toThrow();
  });

  it('aborts evaluation when the timeout elapses', async () => {
    vi.stubEnv('OPEN_PREP_AI_TIMEOUT_MS', '1');
    switchboardMocks.chat.mockImplementation(
      (_input: unknown, options: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );

    const provider = new SwitchboardProvider('codex');
    const evaluation = provider.evaluateWriting({
      prompt: basePrompt,
      essayText: 'Remote work is useful for many employees.',
    });

    await expect(evaluation).rejects.toThrow('AI evaluation timed out after 1ms.');
  });

  it('surfaces Switchboard failures', async () => {
    switchboardMocks.chat.mockRejectedValue(new Error('Switchboard failed'));

    const provider = new SwitchboardProvider('codex');

    await expect(
      provider.evaluateWriting({
        prompt: basePrompt,
        essayText: 'Remote work is useful for many employees.',
      }),
    ).rejects.toThrow('Switchboard failed');
  });
});
