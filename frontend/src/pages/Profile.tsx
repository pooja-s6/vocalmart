import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

export function Profile() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="page">
      <div className="profile-card">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <p className="muted">Role: {user.role}</p>
        <p className="muted">Member since {formatDate(user.createdAt)}</p>
        <div className="hero-actions">
          <Link className="btn secondary" to="/orders">View orders</Link>
          {user.role === 'ADMIN' && <Link className="btn" to="/admin">Admin dashboard</Link>}
          <button className="btn ghost" type="button" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
