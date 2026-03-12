import { useEffect, useState } from 'react';
import { AuthClient } from '@monorepo/auth-client';
import { User } from '@monorepo/types';
import './App.css';

const API_BASE_URL = 'http://localhost:3000';
const AUTH_GATEWAY_URL = 'http://localhost:3001';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for token passed via URL (from auth-gateway on a different port/origin)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);
      // Clean the token from the URL bar
      window.history.replaceState({}, '', window.location.pathname);
    }

    const token = tokenFromUrl || localStorage.getItem('authToken');

    if (!token) {
      // No token, redirect to login
      window.location.href = AUTH_GATEWAY_URL;
      return;
    }

    // Fetch user data
    const authClient = new AuthClient(API_BASE_URL);
    authClient.getCurrentUser()
      .then((userData) => {
        if (userData) {
          setUser(userData);
        } else {
          // Invalid token, redirect to login
          localStorage.clear();
          window.location.href = `${AUTH_GATEWAY_URL}?logout=true`;
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user:', err);
        setError('Failed to load user data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = `${AUTH_GATEWAY_URL}?logout=true`;
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <strong>Error:</strong> {error}
        <button onClick={handleLogout} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
          Back to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">👤 User Portal</div>
        <div className="navbar-actions">
          <span className="user-info">Welcome, {user.username}</span>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: 'var(--text)' }}>Dashboard</h1>

        <div className="dashboard">
          <div className="card">
            <h2>👤 Profile Information</h2>
            <div className="card-content">
              <div className="profile-field">
                <span className="profile-label">User ID:</span>
                <span className="profile-value">{user.userId}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Username:</span>
                <span className="profile-value">{user.username}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Email:</span>
                <span className="profile-value">{user.email || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Role:</span>
                <span className="profile-value">
                  <span className="badge">{user.role}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>📊 Account Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">12</div>
                <div className="stat-label">Active Sessions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">48</div>
                <div className="stat-label">Total Activities</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>📋 Recent Activity</h2>
          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-text">✓ Logged in successfully</span>
              <span className="activity-time">Just now</span>
            </li>
            <li className="activity-item">
              <span className="activity-text">📝 Profile updated</span>
              <span className="activity-time">2 hours ago</span>
            </li>
            <li className="activity-item">
              <span className="activity-text">🔐 Password changed</span>
              <span className="activity-time">1 day ago</span>
            </li>
            <li className="activity-item">
              <span className="activity-text">📧 Email verified</span>
              <span className="activity-time">3 days ago</span>
            </li>
          </ul>
        </div>

        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2>ℹ️ About This Application</h2>
          <div className="card-content">
            <p style={{ marginBottom: '0.5rem' }}>
              This is a React-based user portal demonstrating the monorepo architecture.
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Built with:</strong> React, TypeScript, Vite
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Shared packages:</strong> @monorepo/auth-client, @monorepo/types
            </p>
            <p>
              <strong>Authentication:</strong> Token-based via Auth Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
