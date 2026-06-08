import os from 'node:os';
import path from 'node:path';

const codexPathDirectories = [
  path.join(os.homedir(), '.local', 'bin'),
  path.join(os.homedir(), '.npm-global', 'bin'),
  '/opt/homebrew/bin',
  '/usr/local/bin',
];

const uniquePathEntries = (entries: string[]): string[] => {
  const seenEntries = new Set<string>();

  return entries.filter((entry) => {
    if (!entry || seenEntries.has(entry)) {
      return false;
    }

    seenEntries.add(entry);
    return true;
  });
};

export const resolveCodexCommand = (): string => {
  const configuredCommand = process.env.OPEN_PREP_CODEX_PATH?.trim();

  return configuredCommand && configuredCommand.length > 0 ? configuredCommand : 'codex';
};

export const buildCodexEnvironment = (
  environment: Record<string, string | undefined> = process.env,
): Record<string, string | undefined> => {
  const existingPathEntries = (environment.PATH ?? '')
    .split(path.delimiter)
    .filter((entry) => entry.length > 0);
  const PATH = uniquePathEntries([...codexPathDirectories, ...existingPathEntries]).join(
    path.delimiter,
  );

  return {
    ...environment,
    PATH,
  };
};

export const buildCodexNotFoundMessage = (
  environment: Record<string, string | undefined>,
): string =>
  [
    'Codex CLI was not found.',
    'Install Codex CLI or set OPEN_PREP_CODEX_PATH to its full executable path.',
    `PATH checked: ${environment.PATH ?? ''}`,
  ].join(' ');
