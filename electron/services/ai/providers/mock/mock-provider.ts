import type { AiProvider, WritingEvaluationRequest } from '../../core/ai-provider';
import type { WritingEvaluation } from '../../../../../src/shared/domain/evaluations/evaluation-types';

export class MockProvider implements AiProvider {
  public readonly id = 'mock' as const;

  public async evaluateWriting(request: WritingEvaluationRequest): Promise<WritingEvaluation> {
    const excerpt = request.essayText.slice(0, Math.min(request.essayText.length, 32));

    return {
      overallScore: 4,
      overallMaxScore: 6,
      summary:
        'Your response is organized and readable, but it still needs more precise vocabulary and stronger support for the main claim.',
      nextStep:
        'Add one concrete example and replace at least two informal phrases with more academic wording.',
      criterionScores: [
        {
          criterion: 'organization',
          label: 'Organization',
          score: 5,
          maxScore: 5,
          comment:
            'The response follows a clear structure and moves logically from the main claim to supporting points.',
        },
        {
          criterion: 'grammarAndMechanics',
          label: 'Grammar & Mechanics',
          score: 5,
          maxScore: 5,
          comment:
            'Grammar is generally correct and sentence boundaries are controlled well throughout the response.',
        },
        {
          criterion: 'languageAccuracy',
          label: 'Language Accuracy',
          score: 3,
          maxScore: 5,
          comment:
            'The language is understandable, but the vocabulary range is limited and several choices sound informal for TOEFL® writing.',
        },
        {
          criterion: 'developmentAndSupport',
          label: 'Development & Support',
          score: 2,
          maxScore: 5,
          comment:
            'The response states a position, but it would benefit from more specific evidence and a fuller explanation of the reasoning.',
        },
      ],
      highlights: [
        {
          id: 'mock-highlight-1',
          excerpt,
          replacement: 'particularly',
          category: 'idiomatic-word-choice',
          explanation:
            'This phrase can sound too conversational for an academic response. A more precise adverb keeps the tone formal.',
          alternatives: ['particularly', 'notably', 'especially', 'significantly'],
          startOffset: 0,
          endOffset: Math.min(6, request.essayText.length),
        },
      ],
    };
  }
}
