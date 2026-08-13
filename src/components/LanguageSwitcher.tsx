'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '@/i18n/config';

const LOCALE_LABELS: Record<Locale, string> = {
  sv: 'SV',
  en: 'EN'
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-stamp border border-asphalt-700/40 p-0.5 dark:border-chalk-500/30">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          className={`rounded-sm px-2 py-1 font-mono-tight text-xs transition ${
            locale === l
              ? 'bg-spray text-asphalt-950'
              : 'text-current opacity-60 hover:opacity-100'
          }`}
          aria-current={locale === l}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
