import fs from 'node:fs';
import path from 'node:path';

import * as v from 'valibot';

import type {
  PromptDetails,
  PromptDiscussionParticipant,
  PromptDiscussionParticipantGender,
  PromptType,
} from '../../../src/shared/domain/prompts/prompt-types';
import { storedPromptFileSchema } from '../../../src/shared/schemas/prompt-schemas';

const getAppRoot = (): string => process.env.APP_ROOT ?? process.cwd();

const resolveWritingPromptsDirectory = (): string =>
  path.resolve(getAppRoot(), 'prompts', 'writing');

const isJsonFile = (fileName: string): boolean => fileName.toLowerCase().endsWith('.json');

const professorNames = {
  female: [
    'Dr. Maya Patel',
    'Dr. Elena Brooks',
    'Dr. Nina Alvarez',
    'Dr. Rachel Kim',
    'Dr. Sonia Bennett',
    'Dr. Priya Shah',
  ],
  male: [
    'Dr. Marcus Bennett',
    'Dr. Daniel Cho',
    'Dr. Adrian Foster',
    'Dr. Leo Ramirez',
    'Dr. Victor Hall',
    'Dr. Simon Carter',
  ],
} as const;

const studentNames = {
  female: ['Ava', 'Nora', 'Jasmine', 'Lena', 'Tanya', 'Mila', 'Naomi', 'Sofia'],
  male: ['Sam', 'Ethan', 'Leo', 'Noah', 'Owen', 'Mateo', 'Julian', 'Miles'],
} as const;

const avatarUrls = {
  female: [
    '/avatars/uifaces/125.jpg',
    '/avatars/uifaces/128.jpg',
    '/avatars/uifaces/217.jpg',
    '/avatars/uifaces/219.jpg',
    '/avatars/uifaces/220.jpg',
    '/avatars/uifaces/221.jpg',
  ],
  male: [
    '/avatars/uifaces/80.jpg',
    '/avatars/uifaces/92.jpg',
    '/avatars/uifaces/218.jpg',
    '/avatars/uifaces/222.jpg',
  ],
} as const;

type RawStoredPrompt = v.InferOutput<typeof storedPromptFileSchema>[number];

const stripHtml = (value: string): string =>
  value
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

const hashString = (value: string): number =>
  Array.from(value).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) % 2147483647,
    0,
  );

const pickDeterministicUnique = (
  values: readonly string[],
  seed: string,
  usedValues: Set<string>,
): string => {
  const startIndex = hashString(seed) % values.length;

  for (let offset = 0; offset < values.length; offset += 1) {
    const value = values[(startIndex + offset) % values.length];

    if (!usedValues.has(value)) {
      usedValues.add(value);
      return value;
    }
  }

  return values[startIndex];
};

const pickGender = (seed: string): PromptDiscussionParticipantGender =>
  hashString(seed) % 2 === 0 ? 'female' : 'male';

const buildParticipant = (
  promptId: string,
  role: PromptDiscussionParticipant['role'],
  message: string,
  gender: PromptDiscussionParticipantGender,
  usedNames: Set<string>,
  usedAvatarUrls: Set<string>,
): PromptDiscussionParticipant => {
  const namePool = role === 'professor' ? professorNames[gender] : studentNames[gender];
  const name = pickDeterministicUnique(namePool, `${promptId}:${role}:name`, usedNames);
  const avatarUrl = pickDeterministicUnique(
    avatarUrls[gender],
    `${promptId}:${role}:avatar`,
    usedAvatarUrls,
  );

  return {
    role,
    name,
    gender,
    avatarUrl,
    message,
  };
};

const extractRecommendedWordCount = (scenarioText: string): string => {
  const atLeastMatch = scenarioText.match(/at least (\d+) words?/i);

  if (atLeastMatch) {
    return `${atLeastMatch[1]} words minimum`;
  }

  const rangeMatch = scenarioText.match(/(\d+)\s*-\s*(\d+) words?/i);

  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]} words`;
  }

  return '';
};

const normalizeScenarioPrompt = (
  prompt: Extract<RawStoredPrompt, { scenario: string }>,
): PromptDetails => {
  const scenarioText = stripHtml(prompt.scenario);
  const promptType = prompt.type as Exclude<PromptType, 'legacy'>;
  const discussionParticipants: PromptDiscussionParticipant[] = [];

  if (prompt.type === 'academic-discussion' && prompt.discussion) {
    const usedNames = new Set<string>();
    const usedAvatarUrls = new Set<string>();
    const professorGender = pickGender(`${prompt.id}:professor`);
    const studentAGender = pickGender(`${prompt.id}:student-a`);
    const studentBGender = pickGender(`${prompt.id}:student-b`);

    discussionParticipants.push(
      buildParticipant(
        prompt.id,
        'professor',
        prompt.discussion.professor,
        professorGender,
        usedNames,
        usedAvatarUrls,
      ),
      buildParticipant(
        prompt.id,
        'student',
        prompt.discussion.studentA,
        studentAGender,
        usedNames,
        usedAvatarUrls,
      ),
      buildParticipant(
        prompt.id,
        'student',
        prompt.discussion.studentB,
        studentBGender,
        usedNames,
        usedAvatarUrls,
      ),
    );
  }

  const professorPrompt =
    discussionParticipants.find((participant) => participant.role === 'professor')?.message ?? '';
  const studentDiscussion = discussionParticipants
    .filter((participant) => participant.role === 'student')
    .map((participant) => `${participant.name}: ${participant.message}`)
    .join('\n\n');

  return {
    id: prompt.id,
    title: prompt.title,
    category: prompt.category,
    examType: prompt.examType,
    sectionType: prompt.sectionType,
    promptType,
    scenario: prompt.scenario,
    discussionParticipants,
    instructions: scenarioText,
    question: professorPrompt,
    passage: studentDiscussion,
    recommendedWordCount: extractRecommendedWordCount(scenarioText),
    lastScore: null,
    lastCompletedAt: null,
  };
};

const normalizeLegacyPrompt = (
  prompt: Extract<RawStoredPrompt, { instructions: string }>,
): PromptDetails => ({
  id: prompt.id,
  title: prompt.title,
  category: prompt.category,
  examType: prompt.examType,
  sectionType: prompt.sectionType,
  promptType: 'legacy',
  scenario: `<p>${prompt.instructions}</p>`,
  discussionParticipants: [],
  instructions: prompt.instructions,
  question: prompt.question,
  passage: prompt.passage,
  recommendedWordCount: prompt.recommendedWordCount,
  lastScore: null,
  lastCompletedAt: null,
});

const normalizePrompt = (prompt: RawStoredPrompt): PromptDetails =>
  'scenario' in prompt ? normalizeScenarioPrompt(prompt) : normalizeLegacyPrompt(prompt);

export const getWritingPromptsDirectory = (): string => resolveWritingPromptsDirectory();

export const loadWritingPromptsFromFiles = (): PromptDetails[] => {
  const writingPromptsDirectory = resolveWritingPromptsDirectory();

  if (!fs.existsSync(writingPromptsDirectory)) {
    throw new Error(`Writing prompts directory not found: ${writingPromptsDirectory}`);
  }

  const fileNames = fs.readdirSync(writingPromptsDirectory).filter(isJsonFile).sort();

  if (fileNames.length === 0) {
    throw new Error(`No writing prompt JSON files found in ${writingPromptsDirectory}`);
  }

  return fileNames.flatMap((fileName) => {
    const filePath = path.join(writingPromptsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');

    try {
      const parsedContents = JSON.parse(fileContents) as unknown;
      return v.parse(storedPromptFileSchema, parsedContents).map(normalizePrompt);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      throw new Error(`Invalid writing prompt file "${fileName}": ${message}`);
    }
  });
};
