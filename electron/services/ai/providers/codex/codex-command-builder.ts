import type { WritingEvaluationRequest } from '../../core/ai-provider';

const buildRubricDefinition = (): string =>
  [
    'Return valid JSON only.',
    'Evaluate the writing using TOEFL®-style writing criteria.',
    'Use this exact shape:',
    '{',
    '  "overallScore": number,',
    '  "overallMaxScore": 6,',
    '  "summary": string,',
    '  "nextStep": string,',
    '  "criterionScores": [',
    '    { "criterion": "organization" | "grammarAndMechanics" | "languageAccuracy" | "developmentAndSupport", "label": string, "score": number, "maxScore": 5, "comment": string }',
    '  ],',
    '  "highlights": [',
    '    { "id": string, "excerpt": string, "replacement": string, "category": "grammar-spelling" | "relevance" | "idiomatic-word-choice" | "elaboration", "explanation": string, "alternatives": string[], "startOffset": number, "endOffset": number }',
    '  ]',
    '}',
    'If no useful highlight exists, return an empty highlights array.',
    'Every highlight must include startOffset and endOffset from the student essay. Omit highlights when exact offsets are unclear.',
  ].join('\n');

const stripHtml = (value: string): string =>
  value
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

const buildPromptContext = (request: WritingEvaluationRequest): string[] => {
  const context = [
    `Exam: ${request.prompt.examType.toUpperCase()}`,
    `Section: ${request.prompt.sectionType.toUpperCase()}`,
    `Category: ${request.prompt.category}`,
    `Prompt type: ${request.prompt.promptType}`,
    `Scenario: ${stripHtml(request.prompt.scenario)}`,
  ];

  if (request.prompt.discussionParticipants.length > 0) {
    context.push(
      'Discussion:',
      ...request.prompt.discussionParticipants.map(
        (participant) => `${participant.name} (${participant.role}): ${participant.message}`,
      ),
    );
  }

  if (request.prompt.recommendedWordCount) {
    context.push(`Recommended length: ${request.prompt.recommendedWordCount}`);
  }

  return context;
};

export const buildCodexPrompt = (
  request: WritingEvaluationRequest,
  systemPrompt: string,
): string =>
  [
    systemPrompt.trim(),
    '',
    buildRubricDefinition(),
    '',
    'Context:',
    ...buildPromptContext(request),
    '',
    'Student essay:',
    request.essayText,
    '',
    'Keep the feedback concise, specific, and encouraging.',
  ].join('\n');
