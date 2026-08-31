import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

const BULLET_ERAS = ['era1980', 'era2000'] as const;
const INTRO_BULLET_ERAS = ['era1990', 'era2020'] as const;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'history' });
  return { title: t('pageTitle'), description: t('metaDescription') };
}

export default async function HistoryPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'history' });
  const tDisciplines = await getTranslations({ locale, namespace: 'disciplines' });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">{t('pageTitle')}</h1>
      <p className="mt-4 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">{t('intro')}</p>

      <div className="mt-10 space-y-8">
        {/* 1950-talet — enkel brödtext */}
        <section className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
          <h2 className="font-display text-xl tracking-tight text-spray">{t('eras.era1950.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
            {t('eras.era1950.body')}
          </p>
        </section>

        {/* 1970-talet — intro + 3 punkter + outro */}
        <section className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
          <h2 className="font-display text-xl tracking-tight text-spray">{t('eras.era1970.title')}</h2>
          <p className="mt-2 text-sm font-semibold text-asphalt-800/90 dark:text-chalk-300/90">
            {t('eras.era1970.intro')}
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
            {t.raw('eras.era1970.changes').map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('eras.era1970.outro')}</p>
        </section>

        {/* 1980-talet och 2000-talet — bara punktlistor */}
        {BULLET_ERAS.map((era) => (
          <section key={era} className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
            <h2 className="font-display text-xl tracking-tight text-spray">{t(`eras.${era}.title`)}</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
              {t.raw(`eras.${era}.bullets`).map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        ))}

        {/* 1990-talet och 2020-talet — intro + punktlista */}
        {INTRO_BULLET_ERAS.map((era) => (
          <section key={era} className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
            <h2 className="font-display text-xl tracking-tight text-spray">{t(`eras.${era}.title`)}</h2>
            <p className="mt-2 text-sm font-semibold text-asphalt-800/90 dark:text-chalk-300/90">
              {t(`eras.${era}.intro`)}
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
              {t.raw(`eras.${era}.bullets`).map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Tidslinje */}
      <div className="mt-12 border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
        <h2 className="font-display text-xl tracking-tight">{t('timelineTitle')}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse font-mono-tight text-xs">
            <thead>
              <tr className="border-b border-asphalt-700/25 text-left uppercase tracking-wide text-chalk-500 dark:border-chalk-500/20">
                <th className="py-2 pr-6">{t('timelineHeaders.year')}</th>
                <th className="py-2">{t('timelineHeaders.event')}</th>
              </tr>
            </thead>
            <tbody>
              {t.raw('timelineRows').map((row: { year: string; event: string }, i: number) => (
                <tr key={i} className="border-b border-asphalt-700/10 dark:border-chalk-500/10">
                  <td className="py-2.5 pr-6 font-semibold">{row.year}</td>
                  <td className="py-2.5 text-asphalt-800/80 dark:text-chalk-300/80">{row.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-8 text-sm italic leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {t('closingText')}
      </p>
      <p className="mt-4 text-xs text-chalk-500">{t('sourcesNote')}</p>

      <Link
        href="/disciplines"
        className="mt-8 inline-flex items-center gap-2 rounded-stamp border border-asphalt-700/30 px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide hover:border-spray hover:text-spray dark:border-chalk-500/20"
      >
        {tDisciplines('navTitle')}
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}
