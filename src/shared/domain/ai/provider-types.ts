export const switchboardProviderTypes = ['claude-code', 'codex', 'ollama', 'opencode'] as const;
export const aiProviderTypes = [...switchboardProviderTypes, 'mock'] as const;

export type AiProviderType = (typeof aiProviderTypes)[number];
export type SwitchboardProviderType = (typeof switchboardProviderTypes)[number];
