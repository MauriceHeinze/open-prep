import { Link } from 'react-router-dom';

type BackLinkProps = {
  to: string;
  label: string;
};

export const BackLink = ({ to, label }: BackLinkProps): JSX.Element => (
  <Link className="back-link" to={to}>
    <span aria-hidden="true">‹</span>
    {label}
  </Link>
);
