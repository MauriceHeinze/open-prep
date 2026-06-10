import type { Codex } from '@openai/codex-sdk';

export const createCodexClient = async (): Promise<Codex> => {
  const { Codex } = await import('@openai/codex-sdk');

  return new Codex();
};
