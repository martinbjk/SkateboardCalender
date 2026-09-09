'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Home, Newspaper, Info, X } from 'lucide-react';
import clsx from 'clsx';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from '@/lib/nav/config';

/**
 * MOBIL BOTTEN-NAV (app-stil) — tre flikar: Hem, Artiklar, Info.
 *
 * - Visas BARA på mobil (`sm:hidden` — samma brytpunkt som headern).
 * - Alltid mörk (asphalt-950 + spray-accent) oavsett ljust/mörkt tema,
 *   precis som en app-nav; rör inte sajtens temaväxling.
 * - Aktiv flik markeras med spray-färg + understruken etikett.
 * - "Info" öppnar en bottom sheet med de mindre sidorna (samma som
 *   footern listar) så de går att nå utan att scrolla längst ner.
 *   Innehållet styrs av NAV_ITEMS i src/lib/nav/config.ts.
 *
 * Rör INTE headern. Språk/tema hanteras bara där.
 */

const INFO_PATHS = NAV_ITEMS.map((i) => i.href);

const isPathIn = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

export default function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isHome = pathname === '/';
  const isArticles = isPathIn(pathname, '/articles');
  const isInfo = menuOpen || INFO_PATHS.some((p) => isPathIn(pathname, p));

  return (
    <>
      <nav
        aria-label={t('bottomNav.menuTitle')}
        className="fixed inset-x-0 bottom-0 z-40 flex h-14 border-t border-white/10 bg-asphalt-950/95 backdrop-blur sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Tab as="link" href="/" active={isHome} icon={<Home size={20} />} label={t('bottomNav.home')} />
        <Tab
          as="link"
          href="/articles"
          active={isArticles}
          icon={<Newspaper size={20} />}
          label={t('bottomNav.articles')}
        />
        <Tab
          as="button"
          active={isInfo}
          expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          icon={<Info size={20} />}
          label={t('bottomNav.info')}
        />
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label={t('bottomNav.close')}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[75vh] flex-col rounded-t-2xl border-t border-white/10 bg-asphalt-950 pb-[env(safe-area-inset-bottom)]">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="font-mono-tight text-xs font-bold uppercase tracking-wide text-chalk-100">
                {t('bottomNav.menuTitle')}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t('bottomNav.close')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-chalk-500 transition-colors hover:bg-white/10 hover:text-chalk-100"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="overflow-y-auto py-1">
              <ul>
                {NAV_ITEMS.map((item) => {
                  const active = isPathIn(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={clsx(
                          'block px-4 py-3 text-sm transition-colors',
                          active ? 'text-spray' : 'text-chalk-300 hover:bg-white/5 hover:text-chalk-100'
                        )}
                      >
                        {item.translationKey ? t(item.translationKey) : item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

type TabProps = {
  active: boolean;
  icon: ReactNode;
  label: string;
} & (
  | { as: 'link'; href: string }
  | { as: 'button'; onClick: () => void; expanded: boolean }
);

function Tab(props: TabProps) {
  const cls = clsx(
    'flex flex-1 flex-col items-center justify-center gap-1 transition-colors',
    props.active ? 'text-spray' : 'text-chalk-500 hover:text-chalk-300'
  );
  const inner = (
    <>
      {props.icon}
      <span
        className={clsx(
          'border-b-2 font-mono-tight text-[10px] font-bold uppercase tracking-wide',
          props.active ? 'border-spray' : 'border-transparent'
        )}
      >
        {props.label}
      </span>
    </>
  );

  if (props.as === 'link') {
    return (
      <Link href={props.href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={props.onClick} aria-expanded={props.expanded} className={cls}>
      {inner}
    </button>
  );
}
