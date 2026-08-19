// Temporary front-end-only data layer.
// Uses localStorage as a stand-in for Firebase so the app is fully
// functional for demoing and testing before the real backend is wired in.
// Both temp accounts share the same browser storage, so switching the
// logged-in user shows the same synced feed, same as two phones would.

const STORAGE_KEY = 'us_app_entries_v2';
const USERS_KEY = 'us_app_users_v2';

export const DEFAULT_USERS = [
  { id: 'u1', name: 'Madhesh', password: '1234' },
  { id: 'u2', name: 'Amogaa', password: '1234' },
];

const HAPPY_EMOJIS = ['😊', '🥰', '❤️', '✌️'];
const CLOSING_MESSAGES = [
  "You're more important than my ego.",
  'I love you so much.',
  "We're okay. We're always okay.",
];

export function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

function seedEntries() {
  const now = Date.now();
  return [
    {
      id: 'e1',
      starterId: 'u1',
      emoji: '😔',
      text: 'Felt a bit off after our call today, missed talking properly.',
      createdAt: now - 1000 * 60 * 60 * 5,
      seenBy: [],
      replies: [
        {
          id: 'r1',
          authorId: 'u2',
          text: "I'm sorry, I didn't realize. Can I call you now?",
          createdAt: now - 1000 * 60 * 55,
          seenBy: [],
        },
      ],
      resolvedBy: {},
      resolved: false,
    },
    {
      id: 'e2',
      starterId: 'u2',
      emoji: '🙂',
      text: 'Good day today, just wanted you to know.',
      createdAt: now - 1000 * 60 * 30,
      seenBy: [],
      replies: [],
      resolvedBy: {},
      resolved: false,
    },
  ];
}

export function getEntries() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedEntries();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event('us-app-storage'));
}

export function addEntry({ starterId, emoji, text }) {
  const entries = getEntries();
  const newEntry = {
    id: 'e' + Date.now(),
    starterId,
    emoji,
    text: text?.trim() || '',
    createdAt: Date.now(),
    seenBy: [],
    replies: [],
    resolvedBy: {},
    resolved: false,
  };
  saveEntries([newEntry, ...entries]);
  return newEntry;
}

export function addReply({ entryId, authorId, text }) {
  const entries = getEntries();
  const updated = entries.map((entry) => {
    if (entry.id !== entryId) return entry;
    return {
      ...entry,
      replies: [
        ...entry.replies,
        {
          id: 'r' + Date.now(),
          authorId,
          text: text?.trim() || '',
          createdAt: Date.now(),
          seenBy: [],
        },
      ],
    };
  });
  saveEntries(updated);
}

export function markEntrySeen({ entryId, userId }) {
  const entries = getEntries();
  let changed = false;
  const updated = entries.map((entry) => {
    if (entry.id !== entryId) return entry;
    const seenBy = entry.seenBy.includes(userId)
      ? entry.seenBy
      : [...entry.seenBy, userId];
    const repliesSeenUpdated = entry.replies.map((r) => {
      if (r.authorId === userId) return r;
      if (r.seenBy.includes(userId)) return r;
      changed = true;
      return { ...r, seenBy: [...r.seenBy, userId] };
    });
    if (!entry.seenBy.includes(userId)) changed = true;
    return { ...entry, seenBy, replies: repliesSeenUpdated };
  });
  if (changed) saveEntries(updated);
}

export function isEntrySeenByOther(entry, viewerId) {
  // "Seen" reflects whether the OTHER person (not the viewer) has seen it.
  const otherHasSeen =
    entry.seenBy.some((id) => id !== viewerId) ||
    entry.replies.some((r) => r.authorId === viewerId && r.seenBy.length > 0);
  return otherHasSeen;
}

export function replySeenByOther(entry, reply, viewerId) {
  if (reply.authorId !== viewerId) {
    // this reply belongs to the other person; from viewer's perspective
    // it's "seen" once the viewer has opened it (handled elsewhere)
    return true;
  }
  return reply.seenBy.some((id) => id !== viewerId);
}

export function pickResolveEmoji({ entryId, userId, emoji }) {
  const entries = getEntries();
  const updated = entries.map((entry) => {
    if (entry.id !== entryId) return entry;
    return {
      ...entry,
      resolvedBy: { ...entry.resolvedBy, [userId]: emoji },
    };
  });
  saveEntries(updated);
}

export function checkAndFinalizeResolve({ entryId, users }) {
  const entries = getEntries();
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) return null;
  const allPicked = users.every((u) => entry.resolvedBy[u.id]);
  if (allPicked && !entry.resolved) {
    const updated = entries.map((e) =>
      e.id === entryId ? { ...e, resolved: true } : e
    );
    saveEntries(updated);
    return true;
  }
  return allPicked;
}

export function removeResolvedEntry(entryId) {
  const entries = getEntries();
  saveEntries(entries.filter((e) => e.id !== entryId));
}

export function getRandomClosingMessage() {
  return CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)];
}

export { HAPPY_EMOJIS };

export function pruneOldEntries() {
  const entries = getEntries();
  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const kept = entries.filter((e) => e.createdAt > weekAgo || !e.resolved);
  if (kept.length !== entries.length) saveEntries(kept);
}
