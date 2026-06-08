type ScoreBarProps = {
  label: string;
  score: number;
  maxScore: number;
  tone: 'good' | 'warning' | 'critical';
  comment: string;
};

export const ScoreBar = ({
  label,
  score,
  maxScore,
  tone,
  comment,
}: ScoreBarProps): JSX.Element => (
  <article className={`score-card score-card--${tone}`}>
    <h3>{label}</h3>
    <p>{comment}</p>
    <div className="score-card__footer">
      <span>Score</span>
      <strong>{score}</strong>
    </div>
    <div className="score-bar">
      <div
        className={`score-bar__fill score-bar__fill--${tone}`}
        style={{ width: `${(score / maxScore) * 100}%` }}
      />
    </div>
  </article>
);
