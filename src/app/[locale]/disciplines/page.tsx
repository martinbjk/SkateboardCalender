import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

const SIMPLE_SECTIONS = ['street', 'park', 'bowl', 'freestyle'] as const;
const SLALOM_SUB_KEYS = ['ts', 'sps', 'hs', 'gs', 'sgs'] as const;
const OTHER_KEYS = ['miniramp', 'besttrick', 'downhill', 'bankedslalom'] as const;
const FIT_KEYS = ['beginner', 'bigair', 'technique', 'racing', 'compete'] as const;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'disciplines' });
  return { title: t('pageTitle'), description: t('metaDescription') };
}

function CategoryLink({ category, label }: { category: string; label: string }) {
  return (
    <Link
      href={{ pathname: '/', query: { category } }}
      className="mt-3 inline-flex items-center gap-1 font-mono-tight text-xs uppercase tracking-wide text-chalk-500 hover:text-spray"
    >
      {label}
      <ChevronRight size={13} />
    </Link>
  );
}

export default async function DisciplinesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'disciplines' });
  const tHistory = await getTranslations({ locale, namespace: 'history' });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">{t('pageTitle')}</h1>
      <p className="mt-4 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">{t('intro')}</p>

      {/* Enkla sektioner: Street, Park, Bowl, Freestyle */}
      <div className="mt-10 space-y-10">
        {SIMPLE_SECTIONS.map((key) => (
          <section key={key} className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
            <h2 className="font-display text-xl tracking-tight text-spray">{t(`sections.${key}.title`)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
              {t(`sections.${key}.body`)}
            </p>
            <p className="mt-3 font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
              {t(`sections.${key}.featuresTitle`)}
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
              {t.raw(`sections.${key}.features`).map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            {key === 'street' && (
              <>
                <p className="mt-3 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('sections.street.formatNote')}</p>
                <p className="mt-2 text-sm italic text-chalk-500">{t('sections.street.whyNote')}</p>
              </>
            )}
            {(key === 'park' || key === 'bowl' || key === 'freestyle') && (
              <p className="mt-3 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t(`sections.${key}.eventsNote`)}</p>
            )}
            <CategoryLink category={key} label={t('ctaText')} />
          </section>
        ))}

        {/* Vert — utökad med officiellt tävlingsformat */}
        <section className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
          <h2 className="font-display text-xl tracking-tight text-spray">{t('sections.vert.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
            {t('sections.vert.body')}
          </p>

          <p className="mt-4 font-semibold text-sm">{t('sections.vert.formatTitle')}</p>

          <p className="mt-3 font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
            {t('sections.vert.qualifyingTitle')}
          </p>
          <p className="mt-1 text-sm text-asphalt-800/90 dark:text-chalk-300/90">{t('sections.vert.qualifyingBody')}</p>

          <p className="mt-3 font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
            {t('sections.vert.finalTitle')}
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
            {t.raw('sections.vert.finalItems').map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <p className="mt-3 font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
            {t('sections.vert.criteriaTitle')}
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
            {t.raw('sections.vert.criteria').map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <p className="mt-3 text-sm font-semibold text-hazard-dark dark:text-hazard">{t('sections.vert.helmetNote')}</p>
          <p className="mt-3 text-sm text-chalk-500">
            <span className="font-mono-tight uppercase tracking-wide">{t('sections.vert.legendsTitle')}:</span>{' '}
            {t('sections.vert.legends')}
          </p>
          <CategoryLink category="vert" label={t('ctaText')} />
        </section>

        {/* Slalom — utökad med underdisciplin-tabell och straff */}
        <section className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
          <h2 className="font-display text-xl tracking-tight text-spray">{t('sections.slalom.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
            {t('sections.slalom.body')}
          </p>

          <p className="mt-4 font-semibold text-sm">{t('sections.slalom.subTitle')}</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse font-mono-tight text-xs">
              <thead>
                <tr className="border-b border-asphalt-700/25 text-left uppercase tracking-wide text-chalk-500 dark:border-chalk-500/20">
                  <th className="py-2 pr-4">{t('sections.slalom.subHeaders.discipline')}</th>
                  <th className="py-2 pr-4">{t('sections.slalom.subHeaders.distance')}</th>
                  <th className="py-2 pr-4">{t('sections.slalom.subHeaders.cones')}</th>
                  <th className="py-2 pr-4">{t('sections.slalom.subHeaders.surface')}</th>
                  <th className="py-2">{t('sections.slalom.subHeaders.character')}</th>
                </tr>
              </thead>
              <tbody>
                {SLALOM_SUB_KEYS.map((key) => (
                  <tr key={key} className="border-b border-asphalt-700/10 dark:border-chalk-500/10">
                    <td className="py-2.5 pr-4 font-semibold">{t(`sections.slalom.subRows.${key}.name`)}</td>
                    <td className="py-2.5 pr-4 text-asphalt-800/80 dark:text-chalk-300/80">
                      {t(`sections.slalom.subRows.${key}.distance`)}
                    </td>
                    <td className="py-2.5 pr-4 text-asphalt-800/80 dark:text-chalk-300/80">
                      {t(`sections.slalom.subRows.${key}.cones`)}
                    </td>
                    <td className="py-2.5 pr-4 text-asphalt-800/80 dark:text-chalk-300/80">
                      {t(`sections.slalom.subRows.${key}.surface`)}
                    </td>
                    <td className="py-2.5 text-asphalt-800/80 dark:text-chalk-300/80">
                      {t(`sections.slalom.subRows.${key}.character`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 font-mono-tight text-xs uppercase tracking-wide text-chalk-500">
            {t('sections.slalom.penaltiesTitle')}
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-asphalt-800/90 dark:text-chalk-300/90">
            {t.raw('sections.slalom.penalties').map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('sections.slalom.dqNote')}</p>
          <p className="mt-2 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('sections.slalom.startNote')}</p>
          <CategoryLink category="slalom" label={t('ctaText')} />
        </section>

        {/* Övriga discipliner */}
        <section className="border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
          <h2 className="font-display text-xl tracking-tight text-spray">{t('sections.other.title')}</h2>
          <dl className="mt-3 space-y-3">
            {OTHER_KEYS.map((key) => (
              <div key={key}>
                <dt className="font-semibold text-sm">{t(`sections.other.items.${key}.title`)}</dt>
                <dd className="text-sm text-asphalt-800/80 dark:text-chalk-300/80">
                  {t(`sections.other.items.${key}.body`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Vilken disciplin passar dig */}
      <div className="mt-12 border-t border-asphalt-700/15 pt-6 dark:border-chalk-500/10">
        <h2 className="font-display text-xl tracking-tight">{t('fitTitle')}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse font-mono-tight text-xs">
            <thead>
              <tr className="border-b border-asphalt-700/25 text-left uppercase tracking-wide text-chalk-500 dark:border-chalk-500/20">
                <th className="py-2 pr-4">{t('fitHeaders.goal')}</th>
                <th className="py-2">{t('fitHeaders.recommendation')}</th>
              </tr>
            </thead>
            <tbody>
              {FIT_KEYS.map((key) => (
                <tr key={key} className="border-b border-asphalt-700/10 dark:border-chalk-500/10">
                  <td className="py-2.5 pr-4 text-asphalt-800/80 dark:text-chalk-300/80">
                    {t(`fitRows.${key}.goal`)}
                  </td>
                  <td className="py-2.5 font-semibold">{t(`fitRows.${key}.recommendation`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-8 text-xs text-chalk-500">{t('sourcesNote')}</p>

      <Link
        href="/history"
        className="mt-8 inline-flex items-center gap-2 rounded-stamp border border-asphalt-700/30 px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide hover:border-spray hover:text-spray dark:border-chalk-500/20"
      >
        {tHistory('navTitle')}
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}
