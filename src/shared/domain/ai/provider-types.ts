export const aiProviderTypes = ['codex', 'claude-code', 'mock'] as const;

export type AiProviderType = (typeof aiProviderTypes)[number];
