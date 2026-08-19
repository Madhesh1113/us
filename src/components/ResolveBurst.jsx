import { useEffect, useRef, useState } from 'react';

const SHARD_POSITIONS = [
  { x: -6, y: -6, r: -20 },
  { x: 6, y: -8, r: 15 },
  { x: -8, y: 6, r: -10 },
  { x: 8, y: 8, r: 25 },
  { x: 0, y: -10, r: 5 },
  { x: 0, y: 10, r: -15 },
];

export default function ResolveBurst({ originalEmoji, happyEmojis, message, onFinished }) {
  const [phase, setPhase] = useState('whole');
  const shardsRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('shattering'), 400);
    const t2 = setTimeout(() => setPhase('finale'), 1400);
    const t3 = setTimeout(() => {
      if (onFinished) onFinished();
    }, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinished]);

  return (
    <div style={styles.overlay}>
      <div style={styles.stage}>
        {phase !== 'finale' && (
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
            <div
              style={{
                ...styles.wholeEmoji,
                opacity: phase === 'shattering' ? 0 : 1,
              }}
            >
              {originalEmoji}
            </div>
            {phase === 'shattering' && (
              <div ref={shardsRef} style={{ position: 'absolute', inset: 0 }}>
                {SHARD_POSITIONS.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      fontSize: 48,
                      clipPath: `inset(${i * 16}% ${(5 - i) * 10}% ${(5 - i) * 16}% ${i * 10}%)`,
                      transform: `translate(calc(-50% + ${p.x * 8}px), calc(-50% + ${p.y * 8}px)) rotate(${p.r}deg)`,
                      opacity: 0,
                      transition: 'transform 0.9s ease, opacity 0.9s ease',
                    }}
                  >
                    {originalEmoji}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'finale' && (
          <div style={styles.finale}>
            <div style={styles.finaleEmojis}>
              {happyEmojis.map((e, i) => (
                <span key={i} style={styles.finaleEmoji}>
                  {e}
                </span>
              ))}
            </div>
            <p style={styles.finaleMessage}>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(250, 247, 242, 0.97)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  stage: {
    textAlign: 'center',
    maxWidth: 280,
    padding: 24,
  },
  wholeEmoji: {
    fontSize: 56,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s ease',
  },
  finale: {
    animation: 'fadeIn 0.6s ease',
  },
  finaleEmojis: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 14,
  },
  finaleEmoji: {
    fontSize: 32,
  },
  finaleMessage: {
    fontFamily: 'var(--font-display)',
    fontSize: 17,
    color: 'var(--ink)',
    margin: 0,
    lineHeight: 1.5,
  },
};
