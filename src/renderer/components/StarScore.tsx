type StarScoreProps = {
  score: number | null;
};

export const StarScore = ({ score }: StarScoreProps): JSX.Element => (
  <div className="star-score" aria-label={score === null ? 'Not scored yet' : `Score ${score}`}>
    {[1, 2, 3, 4, 5].map((step) => (
      <span
        key={step}
        className={step <= (score ?? 0) ? 'star-score__star star-score__star--filled' : 'star-score__star'}
      >
        {step <= (score ?? 0) ? '★' : '☆'}
      </span>
    ))}
  </div>
);
