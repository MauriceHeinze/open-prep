import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PromptDetails } from '../../../../../src/shared/domain/prompts/prompt-types';

import { CodexProvider, normalizeEvaluationPayload } from './codex-provider';

const codexMocks = vi.hoisted(() => ({
  Codex: vi.fn(),
  run: vi.fn(),
  startThread: vi.fn(),
}));

vi.mock('@openai/codex-sdk', () => ({
  Codex: codexMocks.Codex,
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

describe('CodexProvider', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    codexMocks.Codex.mockImplementation(() => ({
      startThread: codexMocks.startThread,
    }));
    codexMocks.startThread.mockReturnValue({
      run: codexMocks.run,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('evaluates writing through the Codex SDK', async () => {
    codexMocks.run.mockResolvedValue({
      finalResponse: JSON.stringify({
        ...baseEvaluation,
        highlights: [],
      }),
    });

    const provider = new CodexProvider();
    const result = await provider.evaluateWriting({
      prompt: basePrompt,
      essayText: 'Remote work is useful for many employees.',
    });

    expect(result.summary).toBe(baseEvaluation.summary);
    expect(codexMocks.Codex).toHaveBeenCalledWith();
    expect(codexMocks.startThread).toHaveBeenCalledWith({
      model: 'gpt-5.4-mini',
      modelReasoningEffort: 'low',
      skipGitRepoCheck: true,
    });
    expect(codexMocks.run).toHaveBeenCalledWith(
      expect.stringContaining('Student essay:'),
      expect.objectContaining({
        outputSchema: expect.objectContaining({ type: 'object' }),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('rejects malformed JSON returned by the SDK', async () => {
    codexMocks.run.mockResolvedValue({
      finalResponse: 'not json',
    });

    const provider = new CodexProvider();

    await expect(
      provider.evaluateWriting({
        prompt: basePrompt,
        essayText: 'Remote work is useful for many employees.',
      }),
    ).rejects.toThrow();
  });

  it('rejects invalid evaluation payloads returned by the SDK', async () => {
    codexMocks.run.mockResolvedValue({
      finalResponse: JSON.stringify({
        ...baseEvaluation,
        overallScore: 99,
        highlights: [],
      }),
    });

    const provider = new CodexProvider();

    await expect(
      provider.evaluateWriting({
        prompt: basePrompt,
        essayText: 'Remote work is useful for many employees.',
      }),
    ).rejects.toThrow();
  });

  it('aborts SDK evaluation when the Codex timeout elapses', async () => {
    vi.stubEnv('OPEN_PREP_CODEX_TIMEOUT_MS', '1');
    codexMocks.run.mockImplementation((_prompt: string, options: { signal: AbortSignal }) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('aborted')));
      }),
    );

    const provider = new CodexProvider();
    const evaluation = provider.evaluateWriting({
      prompt: basePrompt,
      essayText: 'Remote work is useful for many employees.',
    });

    await expect(evaluation).rejects.toThrow('Codex evaluation timed out after 1ms.');
  });

  it('surfaces SDK failures', async () => {
    codexMocks.run.mockRejectedValue(new Error('SDK failed'));

    const provider = new CodexProvider();

    await expect(
      provider.evaluateWriting({
        prompt: basePrompt,
        essayText: 'Remote work is useful for many employees.',
      }),
    ).rejects.toThrow('SDK failed');
  });
});
