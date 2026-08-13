'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function Hero({ liveCount, upcomingCount }: { liveCount: number; upcomingCount: number }) {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden border-b border-asphalt-700/20 dark:border-chalk-500/15">
      <div className="grip-texture pointer-events-none absolute inset-0 text-asphalt-900/[0.035] dark:text-chalk-100/[0.03]" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono-tight text-xs uppercase tracking-[0.2em] text-spray"
        >
          {t('hero.eyebrow')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display mt-3 max-w-3xl text-4xl leading-[0.98] tracking-tight sm:text-6xl"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-xl text-base text-asphalt-800/80 dark:text-chalk-300/80"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center gap-6 font-mono-tight text-sm"
        >
          <Stat value={liveCount} label={t('status.live')} accent="text-live" pulse={liveCount > 0} />
          <Stat value={upcomingCount} label={t('status.upcoming')} accent="text-spray" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  accent,
  pulse
}: {
  value: number;
  label: string;
  accent: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`relative flex h-2 w-2 ${pulse ? 'animate-pulse-live' : ''}`}>
        <span className={`h-2 w-2 rounded-full ${accent.replace('text-', 'bg-')}`} />
      </span>
      <span className={`text-xl font-bold ${accent}`}>{value}</span>
      <span className="uppercase tracking-wide text-chalk-500">{label}</span>
    </div>
  );
}
