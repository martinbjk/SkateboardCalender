import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles';
import { formatArticleDate } from '@/lib/articles-shared';
import { ArticleMarkdown } from '@/components/ArticleMarkdown';
import { ShareButton } from '@/components/ShareButton';
import { ARTICLE_EMBEDS } from '@/lib/article-embeds/registry';
import { localeAlternates } from '@/lib/seo';

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

  // metaDescription är en valfri frontmatter-override enbart för
  // sökmotor-/delningsbeskrivningen. Saknas den används excerpt, som
  // annars också är den synliga ingresstexten på sidan.
  const metaDescription = article.metaDescription ?? article.excerpt;

  return {
    title: article.title,
    description: metaDescription,
    // Alla artiklar finns på samma URL i alla sju språk (engelskt
    // innehåll som reserv där översättning saknas), så samma reciproka
    // hreflang-kluster som eventsidorna. Se lib/seo.
    alternates: localeAlternates(locale, `articles/${slug}/`),
    // Eventsidorna lutar sig mot fil-konventionen opengraph-image.tsx för
    // sin delningsbild. Artiklarna har istället en färdig ogImage-PNG i
    // frontmatter, så vi sätter bilden explicit här — och måste då även
    // sätta "twitter" själva (rot-layoutens statiska twitter.images vinner
    // annars, precis som kommentaren i events/twitter-image.tsx beskriver).
    openGraph: {
      title: article.title,
      description: metaDescription,
      url: pageUrl,
      type: 'article',
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: metaDescription,
      images: [ogImage]
    }
  };
}

/**
 * Delar artikelns markdown-kropp i två delar runt det avsnitt en
 * artikel-embed ersätter. Kastar hellre ett tydligt fel vid build än
 * tappar innehåll tyst om markörerna inte finns eller ligger i fel
 * ordning (t.ex. efter en redigering av artikeln).
 */
function spliceArticleEmbed(
  rawContent: string,
  splice: { from: string; to: string },
  slug: string
): { before: string; after: string } {
  // Normalisera radslut — markörerna nedan är exakta \n-strängar och en
  // artikel kan committas med CRLF (t.ex. via GitHubs webb-editor).
  const content = rawContent.replace(/\r\n/g, '\n');
  const start = content.indexOf(splice.from);
  const end = content.indexOf(splice.to);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      `Artikel-embed för "${slug}": hittade inte markörerna ${JSON.stringify(splice.from)} → ` +
        `${JSON.stringify(splice.to)} i rätt ordning. Har artikeltexten ändrats?`
    );
  }
  return { before: content.slice(0, start), after: content.slice(end) };
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

  const embed = ARTICLE_EMBEDS[article.slug];
  const split = embed
    ? spliceArticleEmbed(article.content, embed.splice, article.slug)
    : null;

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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ShareButton
          url={`${SITE_URL}/${locale}/articles/${article.slug}/`}
          title={article.title}
          text={article.excerpt}
        />
      </div>

      {embed && split ? (
        <>
          <ArticleMarkdown content={split.before} slug={article.slug} />
          {embed.render()}
          <ArticleMarkdown content={split.after} slug={article.slug} />
        </>
      ) : (
        <ArticleMarkdown content={article.content} slug={article.slug} />
      )}
    </div>
  );
}
