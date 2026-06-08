const fileProtocol = 'file:';

export const resolvePublicAssetUrl = (
  assetUrl: string,
  protocol = globalThis.location?.protocol,
): string => {
  if (protocol !== fileProtocol || !assetUrl.startsWith('/')) {
    return assetUrl;
  }

  return `.${assetUrl}`;
};
