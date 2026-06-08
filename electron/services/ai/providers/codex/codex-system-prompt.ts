import { promises as fs } from 'node:fs';
import path from 'node:path';

const getAppRoot = (): string => process.env.APP_ROOT ?? process.cwd();

export const getCodexSystemPromptPath = (): string =>
  path.resolve(getAppRoot(), 'prompts/system/codex/writing-evaluation.md');

export const loadCodexSystemPrompt = async (): Promise<string> => {
  const systemPromptFilePath = getCodexSystemPromptPath();

  try {
    return await fs.readFile(systemPromptFilePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Missing Codex system prompt file at ${systemPromptFilePath}. Create it before running writing evaluation.`,
    );
  }
};
