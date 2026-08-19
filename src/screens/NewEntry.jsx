import { useState } from 'react';
import EmojiPicker from '../components/EmojiPicker';
import { addEntry } from '../data/store';

export default function NewEntry({ currentUser, onDone, onCancel }) {
  const [step, setStep] = useState('pick');
  const [emoji, setEmoji] = useState(null);
  const [text, setText] = useState('');

  function handlePick(e) {
    setEmoji(e);
    setStep('detail');
  }

  function handleSend() {
    addEntry({ starterId: currentUser.id, emoji, text });
    onDone();
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button type="button" onClick={onCancel} style={styles.backBtn} aria-label="Back">
          <i className="ti ti-arrow-left" style={{ fontSize: 18 }} aria-hidden="true" />
        </button>
        <span style={styles.headerTitle}>
          {step === 'pick' ? 'Pick a feeling' : 'New feeling'}
        </span>
        <span style={{ width: 18 }} />
      </header>

      <div style={styles.body}>
        {step === 'pick' && (
          <EmojiPicker selected={emoji} onSelect={handlePick} />
        )}

        {step === 'detail' && (
          <div>
            <div style={styles.bigEmoji}>{emoji}</div>
            <textarea
              style={styles.textarea}
              placeholder="Say more (optional)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
            />
            <div style={styles.actions}>
              <button type="button" style={styles.secondaryBtn} onClick={() => setStep('pick')}>
                Change emoji
              </button>
              <button type="button" style={styles.sendBtn} onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
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
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--ink)',
    padding: 0,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 500,
  },
  body: {
    padding: '24px 20px',
  },
  bigEmoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 20,
  },
  textarea: {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: 14,
    fontSize: 14,
    resize: 'vertical',
    background: 'var(--bg)',
    color: 'var(--ink)',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 16,
  },
  secondaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    fontSize: 13,
  },
  sendBtn: {
    flex: 1,
    height: 42,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--ink)',
    color: 'var(--surface)',
    fontSize: 13,
    fontWeight: 500,
  },
};
