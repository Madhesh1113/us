import { useState } from 'react';

const CURATED = ['😔', '🙂', '😢', '😤', '🥺', '❤️', '🥰', '😴', '😩', '💭', '🙏', '😅'];

export default function EmojiPicker({ selected, onSelect }) {
  const [showAll, setShowAll] = useState(false);
  const [customValue, setCustomValue] = useState('');

  function handleCustomChange(e) {
    const val = e.target.value;
    setCustomValue(val);
    const match = val.match(/\p{Emoji}/u);
    if (match) {
      onSelect(match[0]);
      setCustomValue('');
      setShowAll(false);
    }
  }

  return (
    <div>
      <div style={styles.grid}>
        {CURATED.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            style={{
              ...styles.cell,
              ...(selected === emoji ? styles.cellSelected : {}),
            }}
            aria-label={'Choose ' + emoji}
          >
            {emoji}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          style={styles.cell}
          aria-label="More emoji"
        >
          &hellip;
        </button>
      </div>
      {showAll && (
        <input
          autoFocus
          style={styles.customInput}
          placeholder="Type or paste any emoji"
          value={customValue}
          onChange={handleCustomChange}
        />
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
  },
  cell: {
    fontSize: 24,
    padding: '8px 0',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    lineHeight: 1,
  },
  cellSelected: {
    background: 'var(--accent-soft)',
    borderColor: 'var(--accent)',
  },
  customInput: {
    marginTop: 10,
    width: '100%',
    height: 40,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    padding: '0 12px',
    fontSize: 16,
  },
};
