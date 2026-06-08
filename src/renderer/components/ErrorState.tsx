type ErrorStateProps = {
  message: string;
};

export const ErrorState = ({ message }: ErrorStateProps): JSX.Element => (
  <div className="status-card status-card--error">
    <p>{message}</p>
  </div>
);
