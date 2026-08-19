import { useState } from 'react';
import { getUsers } from '../data/store';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const users = getUsers();
    const match = users.find(
      (u) => u.name.toLowerCase() === username.trim().toLowerCase()
    );
    if (!match || match.password !== password) {
      setError('Check your username and password and try again.');
      return;
    }
    setError('');
    onLogin(match);
  }

  function quickLogin(user) {
    setUsername(user.name);
    setPassword(user.password);
    onLogin(user);
  }

  const users = getUsers();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <h1 style={styles.brandTitle}>Us</h1>
          <p style={styles.brandSub}>Just for the two of you</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="off"
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="off"
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submit}>
            Log in
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>temporary testing logins</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.quickRow}>
          {users.map((u) => (
            <button
              key={u.id}
              style={styles.quickBtn}
              onClick={() => quickLogin(u)}
              type="button"
            >
              Log in as {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'var(--bg)',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    padding: '32px 28px',
  },
  brand: {
    textAlign: 'center',
    marginBottom: 28,
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 30,
    fontWeight: 500,
    margin: 0,
    color: 'var(--ink)',
  },
  brandSub: {
    fontSize: 13,
    color: 'var(--ink-soft)',
    marginTop: 4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 12,
    color: 'var(--ink-soft)',
  },
  input: {
    height: 42,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    padding: '0 14px',
    fontSize: 14,
    color: 'var(--ink)',
    outline: 'none',
  },
  error: {
    fontSize: 12,
    color: 'var(--red)',
    margin: 0,
  },
  submit: {
    height: 44,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--surface)',
    fontSize: 14,
    fontWeight: 500,
    marginTop: 4,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: '24px 0 16px',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'var(--border)',
  },
  dividerText: {
    fontSize: 10,
    color: 'var(--ink-faint)',
    whiteSpace: 'nowrap',
  },
  quickRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  quickBtn: {
    height: 38,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface-sunken)',
    color: 'var(--ink)',
    fontSize: 13,
  },
};
