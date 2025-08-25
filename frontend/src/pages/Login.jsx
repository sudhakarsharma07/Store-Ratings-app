import React from 'react';
import { request } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin?.(data.user);
    } catch (err) {
      setErr(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h3>Login</h3>
      {err && <div style={{ color: 'red', marginBottom: '1rem' }}>{err}</div>}
      <form onSubmit={submit}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        <button style={{ width: '100%' }}>Login</button>
      </form>

      {/* Login Help Section */}
      <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f9f9f9', borderRadius: '6px' }}>
        <strong>Test Credentials:</strong>
        <ul style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          <li><b>Admin</b> → Email: <code>admin@example.com</code> | Password: <code>admin123</code></li>
          <li><b>Owner</b> → Email: <code>owner@example.com</code> | Password: <code>owner123</code></li>
        </ul>
      </div>
    </div>
  );
}
