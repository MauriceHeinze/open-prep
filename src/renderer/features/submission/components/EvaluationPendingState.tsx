import { resolvePublicAssetUrl } from '@renderer/lib/resolve-public-asset-url';
import { Spinner } from '@/components/ui/spinner';

export const EvaluationPendingState = (): JSX.Element => (
  <section className="evaluation-pending" aria-live="polite" aria-busy="true">
    <div className="evaluation-pending__panel">
      <div className="app-logo evaluation-pending__logo">
        <img
          className="app-logo__image"
          src={resolvePublicAssetUrl('/logo/logo_text_only.svg')}
          alt="Open Prep"
        />
      </div>

      <div className="evaluation-pending__loader">
        <Spinner className="size-20 text-primary" />
      </div>

      <p className="evaluation-pending__subline">
        Analyzing
        <span aria-hidden="true" />
      </p>
    </div>
  </section>
);
