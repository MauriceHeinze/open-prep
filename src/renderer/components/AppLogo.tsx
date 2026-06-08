import { resolvePublicAssetUrl } from '@renderer/lib/resolve-public-asset-url';

export const AppLogo = (): JSX.Element => (
  <img
    className="app-logo__image"
    src={resolvePublicAssetUrl('/logo/logo_full.svg')}
    alt="Open Prep"
  />
);
