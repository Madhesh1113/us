import { useEffect, useState } from 'react';
import Login from './screens/Login';
import Home from './screens/Home';
import NewEntry from './screens/NewEntry';
import Thread from './screens/Thread';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState('home');
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.mode = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <>
      {screen === 'home' && (
        <Home
          currentUser={currentUser}
          onOpenEntry={(id) => {
            setActiveEntryId(id);
            setScreen('thread');
          }}
          onNewEntry={() => setScreen('new')}
          onLogout={() => setCurrentUser(null)}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
        />
      )}

      {screen === 'new' && (
        <NewEntry
          currentUser={currentUser}
          onDone={() => setScreen('home')}
          onCancel={() => setScreen('home')}
        />
      )}

      {screen === 'thread' && (
        <Thread
          entryId={activeEntryId}
          currentUser={currentUser}
          onBack={() => setScreen('home')}
          onResolvedAndClosed={() => setScreen('home')}
        />
      )}
    </>
  );
}
