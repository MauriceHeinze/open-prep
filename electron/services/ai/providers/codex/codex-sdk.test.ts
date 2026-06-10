import { describe, expect, it } from 'vitest';

import { resolveAsarUnpackedPath } from './codex-sdk';

describe('resolveAsarUnpackedPath', () => {
  it('maps Electron asar paths to the unpacked filesystem location', () => {
    expect(
      resolveAsarUnpackedPath(
        '/Applications/OpenPrep.app/Contents/Resources/app.asar/node_modules/@openai/codex-darwin-arm64/package.json',
      ),
    ).toBe(
      '/Applications/OpenPrep.app/Contents/Resources/app.asar.unpacked/node_modules/@openai/codex-darwin-arm64/package.json',
    );
  });

  it('leaves normal development paths unchanged', () => {
    expect(
      resolveAsarUnpackedPath(
        '/Users/developer/open-prep/node_modules/@openai/codex-darwin-arm64/package.json',
      ),
    ).toBe('/Users/developer/open-prep/node_modules/@openai/codex-darwin-arm64/package.json');
  });
});
