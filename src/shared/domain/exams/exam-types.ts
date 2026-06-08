export const examTypes = ['toefl', 'ielts', 'cambridge'] as const;

export type ExamType = (typeof examTypes)[number];
