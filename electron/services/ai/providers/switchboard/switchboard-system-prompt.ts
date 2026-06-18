import { promises as fs } from 'node:fs';
import path from 'node:path';

const getAppRoot = (): string => process.env.APP_ROOT ?? process.cwd();

export const getSwitchboardSystemPromptPath = (): string =>
  path.resolve(getAppRoot(), 'prompts/system/switchboard/writing-evaluation.md');

export const loadSwitchboardSystemPrompt = async (): Promise<string> => {
  const systemPromptFilePath = getSwitchboardSystemPromptPath();

  try {
    return await fs.readFile(systemPromptFilePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Missing AI system prompt file at ${systemPromptFilePath}. Create it before running writing evaluation.`,
      { cause: error },
    );
  }
};
