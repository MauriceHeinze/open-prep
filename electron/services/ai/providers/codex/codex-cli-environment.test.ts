import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildCodexEnvironment,
  buildCodexNotFoundMessage,
  resolveCodexCommand,
  resolveCodexTimeoutMs,
} from './codex-cli-environment';

describe('codex CLI environment', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses codex from PATH by default', () => {
    vi.stubEnv('OPEN_PREP_CODEX_PATH', '');

    expect(resolveCodexCommand()).toBe('codex');
  });

  it('allows an explicit Codex executable path', () => {
    vi.stubEnv('OPEN_PREP_CODEX_PATH', '/custom/bin/codex');

    expect(resolveCodexCommand()).toBe('/custom/bin/codex');
  });

  it('uses a five minute Codex evaluation timeout by default', () => {
    expect(resolveCodexTimeoutMs({})).toBe(300_000);
  });

  it('allows an explicit Codex evaluation timeout', () => {
    expect(resolveCodexTimeoutMs({ OPEN_PREP_CODEX_TIMEOUT_MS: '450000' })).toBe(450_000);
  });

  it('falls back to the default timeout when the configured value is invalid', () => {
    expect(resolveCodexTimeoutMs({ OPEN_PREP_CODEX_TIMEOUT_MS: 'soon' })).toBe(300_000);
    expect(resolveCodexTimeoutMs({ OPEN_PREP_CODEX_TIMEOUT_MS: '-1' })).toBe(300_000);
  });

  it('adds common user CLI directories before the packaged app PATH', () => {
    const environment = buildCodexEnvironment({
      PATH: ['/usr/bin', '/bin'].join(path.delimiter),
    });
    const pathEntries = environment.PATH?.split(path.delimiter) ?? [];

    expect(pathEntries.slice(0, 4)).toEqual([
      path.join(os.homedir(), '.local', 'bin'),
      path.join(os.homedir(), '.npm-global', 'bin'),
      '/opt/homebrew/bin',
      '/usr/local/bin',
    ]);
    expect(pathEntries).toContain('/usr/bin');
    expect(pathEntries).toContain('/bin');
  });

  it('returns a setup hint when Codex cannot be found', () => {
    expect(buildCodexNotFoundMessage({ PATH: '/usr/bin:/bin' })).toContain(
      'set OPEN_PREP_CODEX_PATH',
    );
  });
});
