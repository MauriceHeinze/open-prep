import { Spinner } from '@/components/ui/spinner';

export const LoadingState = (): JSX.Element => (
  <div className="status-card loading-state">
    <Spinner className="size-6 text-primary" />
    <p>Loading…</p>
  </div>
);
