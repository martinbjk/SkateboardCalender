'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from '@/lib/nav/config';

/**
 * DESKTOP "INFO"-MENY — en dropdown i headern som visar samma fem mindre
 * sidor som mobilens bottom-sheet. Innehållet styrs av NAV_ITEMS i
 * src/lib/nav/config.ts (precis som BottomNav) så desktop och mobil hålls
 * i synk automatiskt. Visas bara på desktop; på mobil äger BottomNav
 * samma innehåll.
 *
 * Öppnas ALLTID på klick/tap — hover-only-menyer fungerar inte på
 * pekskärmar (touch-laptops, surfplattor). Hover är ett extra plus för
 * musanvändare: öppnar vid pekare av typen "mouse" och stänger med en
 * kort fördröjning så menyn inte flimrar när man rör sig mellan knappen
 * och panelen.
 */

const isPathIn = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

const CLOSE_DELAY_MS = 120;

export default function InfoMenu() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const anyActive = NAV_ITEMS.some((i) => isPathIn(pathname, i.href));

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Stäng menyn när man navigerar till en ny sida.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Klick utanför + Escape stänger (Escape lämnar också tillbaka fokus
  // till knappen). Lyssnarna sitter bara uppe medan menyn är öppen.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => cancelClose, []);

  const onPointerEnter = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cancelClose();
    setOpen(true);
  };
  const onPointerLeave = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex items-center gap-1 transition-colors hover:text-spray',
          (open || anyActive) && 'text-spray'
        )}
      >
        {t('nav.info')}
        <ChevronDown size={12} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('nav.info')}
          className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-stamp border border-asphalt-700/20 bg-concrete-100 py-1 font-body normal-case tracking-normal shadow-lg dark:border-chalk-500/20 dark:bg-asphalt-900"
        >
          {NAV_ITEMS.map((item) => {
            const active = isPathIn(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={clsx(
                  'block px-4 py-2 text-sm transition-colors',
                  active
                    ? 'font-semibold text-spray'
                    : 'text-asphalt-900 hover:bg-spray/10 hover:text-spray dark:text-chalk-100'
                )}
              >
                {item.translationKey ? t(item.translationKey) : item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
