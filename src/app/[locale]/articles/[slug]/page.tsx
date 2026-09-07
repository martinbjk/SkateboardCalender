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
  // og:image / twitter:image MÅSTE vara en absolut URL för att sociala
  // plattformar ska hämta bilden. Frontmatter-fältet är en rot-relativ
  // sökväg (/images/articles/…), så vi sätter ihop den fulla URL:en
  // explicit här — samma mönster som JSON-LD nedan och som
  // eventsidornas JSON-LD (`${siteUrl}${...}`), i stället för att förlita
  // oss på att metadataBase råkar absolutifiera en relativ sträng.
  const ogImageUrl = `${SITE_URL}${article.ogImage}`;
  // Måtten läses ur PNG-filen vid build-tid (se readPngSize i lib/articles).
  // Med width/height + type får delningskortet samma fullständiga og:image-
  // taggar som eventsidorna redan har — en bild utan deklarerade mått
  // renderas ofta inte alls av Facebooks/LinkedIns crawler.
  const ogImage = {
    url: ogImageUrl,
    alt: article.title,
    type: 'image/png',
    ...(article.ogImageWidth && article.ogImageHeight
      ? { width: article.ogImageWidth, height: article.ogImageHeight }
      : {})
  };

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
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [ogImage]
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
