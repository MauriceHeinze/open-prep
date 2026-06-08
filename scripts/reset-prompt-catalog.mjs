import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';

const writingPromptsDirectory = path.resolve(process.cwd(), 'prompts', 'writing');
const defaultDatabasePath = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  'open-prep',
  'open-prep.db',
);

const isJsonFile = (fileName) => fileName.toLowerCase().endsWith('.json');

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
};

const studentNames = {
  female: ['Ava', 'Nora', 'Jasmine', 'Lena', 'Tanya', 'Mila', 'Naomi', 'Sofia'],
  male: ['Sam', 'Ethan', 'Leo', 'Noah', 'Owen', 'Mateo', 'Julian', 'Miles'],
};

const avatarUrls = {
  female: [
    'https://mockmind-api.uifaces.co/content/human/125.jpg',
    'https://mockmind-api.uifaces.co/content/human/128.jpg',
    'https://mockmind-api.uifaces.co/content/human/217.jpg',
    'https://mockmind-api.uifaces.co/content/human/219.jpg',
    'https://mockmind-api.uifaces.co/content/human/220.jpg',
    'https://mockmind-api.uifaces.co/content/human/221.jpg',
  ],
  male: [
    'https://mockmind-api.uifaces.co/content/human/80.jpg',
    'https://mockmind-api.uifaces.co/content/human/92.jpg',
    'https://mockmind-api.uifaces.co/content/human/218.jpg',
    'https://mockmind-api.uifaces.co/content/human/222.jpg',
  ],
};

const stripHtml = (value) =>
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

const hashString = (value) =>
  Array.from(value).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) % 2147483647,
    0,
  );

const pickDeterministicUnique = (values, seed, usedValues) => {
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

const pickGender = (seed) => (hashString(seed) % 2 === 0 ? 'female' : 'male');

const buildParticipant = (promptId, role, message, gender, usedNames, usedAvatarUrls) => {
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

const extractRecommendedWordCount = (scenarioText) => {
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

const normalizeScenarioPrompt = (prompt) => {
  const scenarioText = stripHtml(prompt.scenario);
  const discussionParticipants = [];

  if (prompt.type === 'academic-discussion' && prompt.discussion) {
    const usedNames = new Set();
    const usedAvatarUrls = new Set();
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
    promptType: prompt.type,
    scenario: prompt.scenario,
    discussionParticipants,
    instructions: scenarioText,
    question: professorPrompt,
    passage: studentDiscussion,
    recommendedWordCount: extractRecommendedWordCount(scenarioText),
  };
};

const normalizeLegacyPrompt = (prompt) => ({
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
});

const normalizePrompt = (prompt) =>
  Object.hasOwn(prompt, 'scenario') ? normalizeScenarioPrompt(prompt) : normalizeLegacyPrompt(prompt);

const loadWritingPromptsFromFiles = () => {
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
    const parsedContents = JSON.parse(fileContents);

    if (!Array.isArray(parsedContents)) {
      throw new Error(`Invalid writing prompt file "${fileName}": top-level value must be an array`);
    }

    return parsedContents.map(normalizePrompt);
  });
};

const databasePath = process.argv[2] ? path.resolve(process.argv[2]) : defaultDatabasePath;

if (!fs.existsSync(databasePath)) {
  throw new Error(`Database not found: ${databasePath}`);
}

const database = new Database(databasePath);
const prompts = loadWritingPromptsFromFiles();

const insertPrompt = database.prepare(`
  INSERT INTO prompts (
    id,
    title,
    category,
    exam_type,
    section_type,
    prompt_type,
    scenario_html,
    discussion_json,
    instructions,
    question,
    passage,
    recommended_word_count
  ) VALUES (
    @id,
    @title,
    @category,
    @examType,
    @sectionType,
    @promptType,
    @scenario,
    @discussionParticipantsJson,
    @instructions,
    @question,
    @passage,
    @recommendedWordCount
  )
`);

const resetPromptCatalog = database.transaction(() => {
  database.prepare('DELETE FROM evaluations').run();
  database.prepare('DELETE FROM attempts').run();
  database.prepare('DELETE FROM prompts').run();

  prompts.forEach((prompt) => {
    insertPrompt.run({
      ...prompt,
      discussionParticipantsJson: JSON.stringify(prompt.discussionParticipants),
    });
  });
});

resetPromptCatalog();

const counts = {
  prompts: database.prepare('SELECT COUNT(*) AS count FROM prompts').get().count,
  attempts: database.prepare('SELECT COUNT(*) AS count FROM attempts').get().count,
  evaluations: database.prepare('SELECT COUNT(*) AS count FROM evaluations').get().count,
};

database.close();

console.log(`Reset prompt catalog in ${databasePath}`);
console.log(JSON.stringify(counts, null, 2));
