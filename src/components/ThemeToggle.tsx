'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('theme');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center rounded-stamp border border-asphalt-700/40 text-current transition hover:border-spray hover:text-spray dark:border-chalk-500/30"
      aria-label={isDark ? t('light') : t('dark')}
      title={isDark ? t('light') : t('dark')}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
