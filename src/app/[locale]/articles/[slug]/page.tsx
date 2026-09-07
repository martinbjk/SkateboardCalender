import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles';
import { formatArticleDate } from '@/lib/articles-shared';
import { ArticleMarkdown } from '@/components/ArticleMarkdown';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/skate-event-calendar';

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const article = getArticleBySlug(locale, slug);
  if (!article) return {};

  const pageUrl = `${SITE_URL}/${locale}/articles/${slug}/`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: pageUrl },
    // Eventsidorna lutar sig mot fil-konventionen opengraph-image.tsx för
    // sin delningsbild. Artiklarna har istället en färdig ogImage-PNG i
    // frontmatter, så vi sätter bilden explicit här — och måste då även
    // sätta "twitter" själva (rot-layoutens statiska twitter.images vinner
    // annars, precis som kommentaren i events/twitter-image.tsx beskriver).
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: pageUrl,
      type: 'article',
      images: [article.ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.ogImage]
    }
  };
}

function articleJsonLd(
  article: NonNullable<ReturnType<typeof getArticleBySlug>>,
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    inLanguage: article.lang,
    image: [`${SITE_URL}${article.ogImage}`],
    url: `${SITE_URL}/${locale}/articles/${article.slug}/`,
    mainEntityOfPage: `${SITE_URL}/${locale}/articles/${article.slug}/`
  };
}

export default async function ArticlePage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const article = getArticleBySlug(locale, slug);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: 'articles' });
  const jsonLd = articleJsonLd(article, locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* eslint-disable-next-line react/no-danger -- JSON-LD kräver rå script-injektion, ingen brukarindata renderas som HTML */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link
        href="/articles"
        className="font-mono-tight text-xs uppercase tracking-wide text-chalk-500 hover:text-spray"
      >
        ← {t('backToArticles')}
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-tight text-[11px] uppercase tracking-wide text-chalk-500">
        <span>{formatArticleDate(article.date, locale)}</span>
        <span aria-hidden>·</span>
        <span>{article.category}</span>
      </div>

      <h1 className="font-display mt-3 text-4xl leading-[1.03] tracking-tight sm:text-5xl">
        {article.title}
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        {article.excerpt}
      </p>

      {article.isFallback && (
        <p className="mt-6 rounded-stamp border border-hazard/40 bg-hazard/10 px-4 py-3 text-sm text-hazard-dark dark:text-hazard">
          {t('onlyInEnglishNote')}
        </p>
      )}

      <ArticleMarkdown content={article.content} slug={article.slug} />
    </div>
  );
}
