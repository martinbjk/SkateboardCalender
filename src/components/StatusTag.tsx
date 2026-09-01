import { useTranslations } from 'next-intl';
import type { EventStatus } from '@/lib/events-shared';
import clsx from 'clsx';

const STYLES: Record<EventStatus, string> = {
  live: 'bg-live text-chalk-100',
  upcoming: 'bg-spray text-asphalt-950',
  finished: 'bg-asphalt-700 text-chalk-300',
  cancelled: 'bg-asphalt-800 text-chalk-500 line-through',
  postponed: 'bg-hazard text-asphalt-950'
};

export function StatusTag({ status, className }: { status: EventStatus; className?: string }) {
  const t = useTranslations('status');
  return (
    <span
      className={clsx(
        'stamp inline-flex -rotate-2 items-center gap-1.5 px-2.5 py-1 font-mono-tight text-[11px] font-bold uppercase tracking-wider shadow-sm',
        STYLES[status],
        className
      )}
    >
      {status === 'live' && (
        <span className="relative flex h-2 w-2">
          {/* animate-ping (Tailwinds inbyggda, skala+opacitet) i stället
              för en box-shadow-animation — box-shadow tvingar repaint
              varje bildruta, vilket mättes ge 640ms INP (dåligt) på
              denna badge i produktion. Samma visuella "radierande
              ring"-effekt, men i princip gratis för webbläsaren. */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chalk-100 opacity-75" />
          <span className="relative inline-flex h-2 w-2 animate-pulse-live rounded-full bg-chalk-100" />
        </span>
      )}
      {status === 'live' ? t('liveNow') : t(status)}
    </span>
  );
}
