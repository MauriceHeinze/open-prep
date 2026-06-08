import { describe, expect, it } from 'vitest';

import { resolvePublicAssetUrl } from './resolve-public-asset-url';

describe('resolvePublicAssetUrl', () => {
  it('keeps absolute public asset paths in browser protocols', () => {
    expect(resolvePublicAssetUrl('/avatars/uifaces/125.jpg', 'http:')).toBe(
      '/avatars/uifaces/125.jpg',
    );
  });

  it('makes absolute public asset paths relative in file protocol builds', () => {
    expect(resolvePublicAssetUrl('/avatars/uifaces/125.jpg', 'file:')).toBe(
      './avatars/uifaces/125.jpg',
    );
  });

  it('does not rewrite non-public asset paths', () => {
    expect(resolvePublicAssetUrl('https://example.com/avatar.jpg', 'file:')).toBe(
      'https://example.com/avatar.jpg',
    );
  });
});
