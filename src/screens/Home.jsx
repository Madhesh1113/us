import { useEffect, useState } from 'react';
import { getEntries, getUsers, isEntrySeenByOther } from '../data/store';
import EntryBox from '../components/EntryBox';
import ProfileMenu from '../components/ProfileMenu';

export default function Home({ currentUser, onOpenEntry, onNewEntry, onLogout, darkMode, onToggleDark }) {
  const [entries, setEntries] = useState(getEntries());
  const users = getUsers();

  useEffect(() => {
    function refresh() {
      setEntries(getEntries());
    }
    window.addEventListener('us-app-storage', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('us-app-storage', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const sorted = [...entries]
    .filter((e) => !e.resolved)
    .sort((a, b) => a.createdAt - b.createdAt);

  function nameFor(id) {
    return users.find((u) => u.id === id)?.name || 'Someone';
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Home</h1>
        <ProfileMenu
          user={currentUser}
          onLogout={onLogout}
          darkMode={darkMode}
          onToggleDark={onToggleDark}
        />
      </header>

      <div style={styles.feed}>
        {sorted.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Nothing here right now.</p>
            <p style={styles.emptySub}>Tap the plus button to share how you feel.</p>
          </div>
        )}
        {sorted.map((entry) => (
          <EntryBox
            key={entry.id}
            entry={entry}
            senderName={nameFor(entry.starterId)}
            isMine={entry.starterId === currentUser.id}
            seen={isEntrySeenByOther(entry, currentUser.id)}
            onClick={() => onOpenEntry(entry.id)}
          />
        ))}
      </div>

      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.dot, background: 'var(--red)' }} />
          Not seen yet
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.dot, background: 'var(--green)' }} />
          Seen
        </span>
      </div>

      <button type="button" style={styles.fab} onClick={onNewEntry} aria-label="Share a feeling">
        <i className="ti ti-plus" style={{ fontSize: 22 }} aria-hidden="true" />
      </button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 480,
    margin: '0 auto',
    background: 'var(--surface)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
  },
  headerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 500,
    margin: 0,
  },
  feed: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: '18px 16px',
    overflowY: 'auto',
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: 500,
    margin: '0 0 4px',
  },
  emptySub: {
    fontSize: 13,
    color: 'var(--ink-soft)',
    margin: 0,
  },
  legend: {
    display: 'flex',
    gap: 16,
    padding: '10px 20px',
    borderTop: '1px solid var(--border)',
    fontSize: 11,
    color: 'var(--ink-soft)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
  },
  fab: {
    position: 'sticky',
    bottom: 20,
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
};
