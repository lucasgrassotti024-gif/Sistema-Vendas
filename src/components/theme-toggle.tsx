'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Alternar tema"
      className="p-2 rounded-xl transition-colors border border-stone-200 dark:border-stone-700/60 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200/70 dark:hover:bg-stone-700/60 text-stone-600 dark:text-stone-300"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-stone-600" />
      )}
    </button>
  );
}
