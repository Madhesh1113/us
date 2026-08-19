import { useEffect, useState } from 'react';
import {
  getEntries,
  getUsers,
  addReply,
  markEntrySeen,
  pickResolveEmoji,
  checkAndFinalizeResolve,
  removeResolvedEntry,
  getRandomClosingMessage,
  HAPPY_EMOJIS,
} from '../data/store';
import ResolveBurst from '../components/ResolveBurst';

export default function Thread({ entryId, currentUser, onBack, onResolvedAndClosed }) {
  const [entries, setEntries] = useState(getEntries());
  const [replyText, setReplyText] = useState('');
  const [showResolvePicker, setShowResolvePicker] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [closingMessage] = useState(getRandomClosingMessage());
  const users = getUsers();

  const entry = entries.find((e) => e.id === entryId);

  useEffect(() => {
    markEntrySeen({ entryId, userId: currentUser.id });
    function refresh() {
      setEntries(getEntries());
    }
    window.addEventListener('us-app-storage', refresh);
    return () => window.removeEventListener('us-app-storage', refresh);
  }, [entryId, currentUser.id]);

  if (!entry) {
    return (
      <div style={styles.page}>
        <p style={{ padding: 20 }}>This has been resolved and cleared.</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  function nameFor(id) {
    return users.find((u) => u.id === id)?.name || 'Someone';
  }

  const starterName = nameFor(entry.starterId);
  const hasAnyReply = entry.replies.length > 0;
  const myResolvePick = entry.resolvedBy[currentUser.id];
  const otherUser = users.find((u) => u.id !== currentUser.id);
  const otherResolvePick = otherUser ? entry.resolvedBy[otherUser.id] : null;

  function handleSendReply() {
    if (!replyText.trim()) return;
    addReply({ entryId, authorId: currentUser.id, text: replyText });
    setReplyText('');
  }

  function handleResolveClick() {
    setShowResolvePicker(true);
  }

  function handlePickHappyEmoji(emoji) {
    pickResolveEmoji({ entryId, userId: currentUser.id, emoji });
    setShowResolvePicker(false);
    const bothDone = checkAndFinalizeResolve({ entryId, users });
    if (bothDone === true) {
      setShowBurst(true);
    }
  }

  function handleBurstFinished() {
    removeResolvedEntry(entryId);
    onResolvedAndClosed();
  }

  const finalEmojis = users.map((u) => entry.resolvedBy[u.id]).filter(Boolean);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button type="button" onClick={onBack} style={styles.iconBtn} aria-label="Back">
          <i className="ti ti-arrow-left" style={{ fontSize: 18 }} aria-hidden="true" />
        </button>
        <span style={styles.headerLabel}>Thread</span>
        <button
          type="button"
          onClick={handleResolveClick}
          disabled={!hasAnyReply}
          style={{
            ...styles.resolveBtn,
            opacity: hasAnyReply ? 1 : 0.4,
            cursor: hasAnyReply ? 'pointer' : 'not-allowed',
          }}
        >
          Mark resolved
        </button>
      </header>

      {!hasAnyReply && (
        <p style={styles.helperText}>Reply first to resolve</p>
      )}
      {hasAnyReply && myResolvePick && !entry.resolved && (
        <p style={styles.helperText}>Waiting for {otherUser?.name} to confirm</p>
      )}

      <div style={styles.emojiHeader}>
        <div style={styles.bigEmoji}>{entry.emoji}</div>
        <div style={styles.emojiMeta}>
          {starterName} &middot; {formatTime(entry.createdAt)}
        </div>
      </div>

      <div style={styles.messages}>
        <MessageBox
          text={entry.text || '(no message, just this feeling)'}
          time={entry.createdAt}
          senderName={starterName}
          isLeft
          seen={true}
        />
        {entry.replies.map((r) => (
          <MessageBox
            key={r.id}
            text={r.text}
            time={r.createdAt}
            senderName={nameFor(r.authorId)}
            isLeft={r.authorId === entry.starterId}
            seen={r.authorId === currentUser.id ? r.seenBy.length > 0 : true}
          />
        ))}
      </div>

      <div style={styles.replyBar}>
        <input
          style={styles.replyInput}
          placeholder="Type a reply"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
        />
        <button type="button" style={styles.replySend} onClick={handleSendReply} aria-label="Send reply">
          <i className="ti ti-send" style={{ fontSize: 16 }} aria-hidden="true" />
        </button>
      </div>

      {showResolvePicker && (
        <div style={styles.pickerOverlay}>
          <div style={styles.pickerCard}>
            <p style={styles.pickerTitle}>Pick a happy one</p>
            <div style={styles.pickerGrid}>
              {HAPPY_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => handlePickHappyEmoji(e)}
                  style={{
                    ...styles.pickerCell,
                    ...(myResolvePick === e ? styles.pickerCellSelected : {}),
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            {myResolvePick && (
              <p style={styles.pickerNote}>You picked this last time</p>
            )}
            <div style={styles.pickerWaiting}>
              <EmojiSlot label={currentUser.name} emoji={myResolvePick} />
              <i className="ti ti-plus" style={{ fontSize: 14, color: 'var(--ink-faint)' }} aria-hidden="true" />
              <EmojiSlot label={otherUser?.name} emoji={otherResolvePick} />
            </div>
            <button
              type="button"
              style={styles.pickerCancel}
              onClick={() => setShowResolvePicker(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showBurst && (
        <ResolveBurst
          originalEmoji={entry.emoji}
          happyEmojis={finalEmojis}
          message={closingMessage}
          onFinished={handleBurstFinished}
        />
      )}
    </div>
  );
}

function EmojiSlot({ label, emoji }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 22 }}>{emoji || '?'}</div>
      <div style={{ fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function MessageBox({ text, time, senderName, isLeft, seen }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isLeft ? 'flex-start' : 'flex-end',
        maxWidth: '75%',
        alignSelf: isLeft ? 'flex-start' : 'flex-end',
        gap: 3,
      }}
    >
      <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{senderName}</span>
      <div
        style={{
          background: seen ? 'var(--green-bg)' : 'var(--red-bg)',
          border: '1px solid ' + (seen ? 'var(--green-border)' : 'var(--red-border)'),
          borderRadius: 'var(--radius-sm)',
          padding: '9px 12px',
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{text}</div>
        <div
          style={{
            fontSize: 10,
            color: seen ? 'var(--green)' : 'var(--red)',
            textAlign: 'right',
            marginTop: 4,
          }}
        >
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
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
    padding: '14px 16px',
    borderBottom: '1px solid var(--border)',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: 'var(--ink)',
  },
  headerLabel: {
    fontSize: 13,
    color: 'var(--ink-soft)',
  },
  resolveBtn: {
    fontSize: 12,
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--accent)',
    background: 'var(--surface)',
    color: 'var(--ink)',
  },
  helperText: {
    fontSize: 11,
    color: 'var(--ink-faint)',
    textAlign: 'center',
    margin: '8px 0 0',
  },
  emojiHeader: {
    textAlign: 'center',
    padding: '18px 0 10px',
  },
  bigEmoji: {
    fontSize: 44,
  },
  emojiMeta: {
    fontSize: 11,
    color: 'var(--ink-faint)',
    marginTop: 4,
  },
  messages: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '10px 16px 20px',
    overflowY: 'auto',
  },
  replyBar: {
    display: 'flex',
    gap: 8,
    padding: '10px 16px',
    borderTop: '1px solid var(--border)',
  },
  replyInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    border: '1px solid var(--border)',
    padding: '0 16px',
    fontSize: 13,
    background: 'var(--bg)',
    outline: 'none',
  },
  replySend: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--surface)',
  },
  pickerOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(43, 38, 33, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    padding: 24,
  },
  pickerCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 22,
    width: '100%',
    maxWidth: 280,
    textAlign: 'center',
  },
  pickerTitle: {
    fontSize: 13,
    color: 'var(--ink-soft)',
    margin: '0 0 14px',
  },
  pickerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
  },
  pickerCell: {
    fontSize: 26,
    padding: '10px 0',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
  },
  pickerCellSelected: {
    background: 'var(--green-bg)',
    borderColor: 'var(--green)',
  },
  pickerNote: {
    fontSize: 11,
    color: 'var(--ink-faint)',
    margin: '10px 0 0',
  },
  pickerWaiting: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 18,
  },
  pickerCancel: {
    marginTop: 18,
    fontSize: 12,
    color: 'var(--ink-soft)',
    background: 'none',
    border: 'none',
  },
};
