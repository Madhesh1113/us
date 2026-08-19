export default function EntryBox({ entry, senderName, isMine, seen, onClick }) {
  const time = formatTime(entry.createdAt);

  return (
    <div
      style={{
        ...styles.wrap,
        alignSelf: isMine ? 'flex-end' : 'flex-start',
        alignItems: isMine ? 'flex-end' : 'flex-start',
      }}
    >
      <span style={styles.name}>{isMine ? 'You' : senderName}</span>
      <button
        type="button"
        onClick={onClick}
        style={{
          ...styles.box,
          background: seen ? 'var(--green-bg)' : 'var(--red-bg)',
          borderColor: seen ? 'var(--green-border)' : 'var(--red-border)',
        }}
      >
        <div style={styles.emoji}>{entry.emoji}</div>
        <div
          style={{
            ...styles.time,
            color: seen ? 'var(--green)' : 'var(--red)',
          }}
        >
          {time}
        </div>
      </button>
    </div>
  );
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    maxWidth: '68%',
  },
  name: {
    fontSize: 11,
    color: 'var(--ink-soft)',
    padding: '0 4px',
  },
  box: {
    border: '1px solid',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    minWidth: 92,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 28,
    lineHeight: 1,
  },
  time: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 6,
  },
};
