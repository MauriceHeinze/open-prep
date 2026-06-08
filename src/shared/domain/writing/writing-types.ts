export const writingCriterionKeys = [
  'organization',
  'grammarAndMechanics',
  'languageAccuracy',
  'developmentAndSupport',
] as const;

export type WritingCriterionKey = (typeof writingCriterionKeys)[number];

export type WritingCriterionScore = {
  criterion: WritingCriterionKey;
  label: string;
  score: number;
  maxScore: number;
  comment: string;
};

export type WritingHighlightCategory =
  | 'grammar-spelling'
  | 'relevance'
  | 'idiomatic-word-choice'
  | 'elaboration';

export type WritingFeedbackHighlight = {
  id: string;
  excerpt: string;
  replacement: string;
  category: WritingHighlightCategory;
  explanation: string;
  alternatives: string[];
  startOffset: number;
  endOffset: number;
};
