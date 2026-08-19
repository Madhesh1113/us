import { useEffect, useRef, useState } from 'react';

export default function ProfileMenu({ user, onLogout, darkMode, onToggleDark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={styles.avatarBtn}
        aria-label="Open profile menu"
      >
        {user.name[0]}
      </button>

      {open && (
        <div style={styles.menu}>
          <div style={styles.menuHeader}>
            <div style={styles.miniAvatar}>{user.name[0]}</div>
            <span style={styles.menuName}>{user.name}</span>
          </div>

          <button type="button" style={styles.menuRow}>
            <i className="ti ti-camera" style={styles.menuIcon} aria-hidden="true" />
            Edit photo
          </button>

          <div style={styles.menuRow}>
            <span style={styles.menuRowLeft}>
              <i className="ti ti-moon" style={styles.menuIcon} aria-hidden="true" />
              Dark mode
            </span>
            <button
              type="button"
              onClick={onToggleDark}
              style={{
                ...styles.toggle,
                background: darkMode ? 'var(--ink)' : 'var(--border)',
              }}
              aria-label="Toggle dark mode"
            >
              <span
                style={{
                  ...styles.toggleDot,
                  transform: darkMode ? 'translateX(13px)' : 'translateX(2px)',
                }}
              />
            </button>
          </div>

          <button type="button" onClick={onLogout} style={styles.logoutRow}>
            <i className="ti ti-logout" style={styles.menuIcon} aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    border: 'none',
    background: 'var(--surface-sunken)',
    color: 'var(--ink-soft)',
    fontSize: 14,
    fontWeight: 500,
  },
  menu: {
    position: 'absolute',
    top: 42,
    right: 0,
    width: 190,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: 8,
    zIndex: 20,
  },
  menuHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 6px 10px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 6,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--surface-sunken)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 500,
  },
  menuName: {
    fontSize: 13,
    fontWeight: 500,
  },
  menuRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    padding: '8px 6px',
    fontSize: 13,
    background: 'none',
    border: 'none',
    color: 'var(--ink)',
    textAlign: 'left',
  },
  menuRowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  menuIcon: {
    fontSize: 15,
    color: 'var(--ink-soft)',
  },
  toggle: {
    width: 30,
    height: 17,
    borderRadius: 10,
    border: 'none',
    position: 'relative',
    padding: 0,
  },
  toggleDot: {
    position: 'absolute',
    top: 2,
    width: 13,
    height: 13,
    borderRadius: '50%',
    background: '#fff',
    transition: 'transform 0.15s ease',
  },
  logoutRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px 6px',
    fontSize: 13,
    background: 'none',
    border: 'none',
    borderTop: '1px solid var(--border)',
    marginTop: 4,
    color: 'var(--red)',
    textAlign: 'left',
  },
};
