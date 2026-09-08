import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getAllArticles } from '@/lib/articles';
import { formatArticleDate } from '@/lib/articles-shared';
import { localeAlternates } from '@/lib/seo';
import FeaturedVideos from '@/components/FeaturedVideos/FeaturedVideos';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/skate-event-calendar';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'articles' });
  const pageUrl = `${SITE_URL}/${locale}/articles/`;

  return {
    title: t('pageTitle'),
    description: t('metaDescription'),
    alternates: localeAlternates(locale, 'articles/'),
    openGraph: {
      title: t('pageTitle'),
      description: t('metaDescription'),
      url: pageUrl,
      type: 'website'
    }
  };
}

export default async function ArticlesPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'articles' });
  const articles = getAllArticles(locale);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">{t('pageTitle')}</h1>
        <p className="mt-4 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
          {t('intro')}
        </p>

        <div className="mt-10 space-y-5">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block rounded-stamp border border-asphalt-700/30 bg-white/60 p-5 shadow-card transition hover:border-spray hover:shadow-card-hover dark:border-chalk-500/15 dark:bg-asphalt-900/60 dark:shadow-card-dark dark:hover:shadow-card-hover-dark"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
                <span>{formatArticleDate(article.date, locale)}</span>
                <span aria-hidden>·</span>
                <span>{article.category}</span>
                {article.isFallback && (
                  <span className="rounded-sm bg-hazard/20 px-1.5 py-0.5 text-hazard-dark dark:text-hazard">
                    {t('onlyInEnglish')}
                  </span>
                )}
              </div>

              <h2 className="font-display mt-2 text-2xl leading-[1.08] tracking-tight text-asphalt-900 group-hover:text-spray dark:text-chalk-100">
                {article.title}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-asphalt-800/80 dark:text-chalk-300/80">
                {article.excerpt}
              </p>

              <span className="mt-3 inline-flex items-center gap-1 font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500 group-hover:text-spray">
                {t('readMore')}
                <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <FeaturedVideos />
    </>
  );
}
