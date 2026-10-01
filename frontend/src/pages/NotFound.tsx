import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page">
      <div className="empty">
        <h1>Page not found</h1>
        <Link className="btn" to="/">Go home</Link>
      </div>
    </div>
  );
}
