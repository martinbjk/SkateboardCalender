'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarPlus, ChevronDown } from 'lucide-react';
import type { SkateEvent } from '@/lib/schema';
import { buildGoogleCalendarUrl, buildIcs } from '@/lib/date';

export function AddToCalendar({ event }: { event: SkateEvent }) {
  const t = useTranslations('event');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  function downloadIcs() {
    const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-stamp bg-spray px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide text-asphalt-950 transition hover:bg-spray-dark"
      >
        <CalendarPlus size={15} />
        {t('addToCalendar')}
        <ChevronDown size={13} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-stamp border border-asphalt-700/20 bg-concrete-100 shadow-lg dark:border-chalk-500/20 dark:bg-asphalt-900">
          <a
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noreferrer noopener"
            className="block px-4 py-2.5 text-sm hover:bg-spray/10 hover:text-spray"
          >
            {t('addToGoogle')}
          </a>
          <button
            type="button"
            onClick={downloadIcs}
            className="block w-full px-4 py-2.5 text-left text-sm hover:bg-spray/10 hover:text-spray"
          >
            {t('downloadIcs')}
          </button>
        </div>
      )}
    </div>
  );
}
