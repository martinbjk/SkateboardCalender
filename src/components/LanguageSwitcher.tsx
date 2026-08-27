'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Globe, Check } from 'lucide-react';
import { locales, type Locale } from '@/i18n/config';

// Fullständiga språknamn, skrivna på respektive språk (standardpraxis för
// språkväljare — t.ex. "Deutsch" inte "German"). Korta koder (SV/EN/...)
// visas bara i den stängda knappen för att spara plats; hela listan i
// dropdownen är alltid tydligt utskriven.
const LOCALE_NAMES: Record<Locale, string> = {
  sv: 'Svenska',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  ja: '日本語'
};

const LOCALE_CODES: Record<Locale, string> = {
  sv: 'SV',
  en: 'EN',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  pt: 'PT',
  ja: 'JA'
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  function selectLocale(l: Locale) {
    router.replace(pathname, { locale: l });
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className="flex items-center gap-1.5 rounded-stamp border border-asphalt-700/40 px-2.5 py-1.5 font-mono-tight text-xs transition hover:border-spray hover:text-spray dark:border-chalk-500/30"
      >
        <Globe size={14} />
        {LOCALE_CODES[locale]}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-stamp border border-asphalt-700/20 bg-concrete-100 py-1 shadow-lg dark:border-chalk-500/20 dark:bg-asphalt-900"
        >
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={locale === l}
              onClick={() => selectLocale(l)}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-spray/10 hover:text-spray ${
                locale === l ? 'font-semibold text-spray' : ''
              }`}
            >
              {LOCALE_NAMES[l]}
              {locale === l && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
