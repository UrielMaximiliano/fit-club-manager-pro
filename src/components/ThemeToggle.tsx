import React from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', 'system');
      const handler = (e: MediaQueryListEvent) => {
        if (localStorage.getItem('theme') === 'system') {
          if (e.matches) root.classList.add('dark');
          else root.classList.remove('dark');
        }
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <div className="flex gap-2 items-center">
      <button
        className={`px-2 py-1 rounded ${theme === 'light' ? 'bg-accent text-white' : 'bg-card border border-border text-text'}`}
        onClick={() => setTheme('light')}
      >
        Claro
      </button>
      <button
        className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-accent text-white' : 'bg-card border border-border text-text'}`}
        onClick={() => setTheme('dark')}
      >
        Oscuro
      </button>
      <button
        className={`px-2 py-1 rounded ${theme === 'system' ? 'bg-accent text-white' : 'bg-card border border-border text-text'}`}
        onClick={() => setTheme('system')}
      >
        Auto
      </button>
    </div>
  );
};

export default ThemeToggle; 