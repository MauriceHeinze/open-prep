import type { ExamType } from '../exams/exam-types';
import type { SectionType } from '../sections/section-types';

export type PromptType = 'academic-discussion' | 'email' | 'legacy';

export type PromptDiscussionParticipantRole = 'professor' | 'student';

export type PromptDiscussionParticipantGender = 'female' | 'male';

export type PromptDiscussionParticipant = {
  role: PromptDiscussionParticipantRole;
  name: string;
  gender: PromptDiscussionParticipantGender;
  avatarUrl: string;
  message: string;
};

export type PromptSummary = {
  id: string;
  title: string;
  category: string;
  examType: ExamType;
  sectionType: SectionType;
  lastScore: number | null;
  lastCompletedAt: string | null;
};

export type PromptDetails = PromptSummary & {
  promptType: PromptType;
  scenario: string;
  discussionParticipants: PromptDiscussionParticipant[];
  instructions: string;
  question: string;
  passage: string;
  recommendedWordCount: string;
};
