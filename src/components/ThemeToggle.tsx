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
    return <div className="h-[38px] w-[38px]" aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-stamp border border-spray/50 bg-asphalt-700 text-chalk-100 shadow-lg transition hover:border-spray hover:shadow-xl active:translate-y-px active:shadow-sm"
      aria-label={isDark ? t('light') : t('dark')}
      title={isDark ? t('light') : t('dark')}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
