import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildCodexEnvironment,
  buildCodexNotFoundMessage,
  resolveCodexCommand,
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
