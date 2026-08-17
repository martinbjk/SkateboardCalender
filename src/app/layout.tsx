import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { locales } from '@/i18n/config';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SetHtmlLang } from '@/components/SetHtmlLang';

/**
 * OBS: ingen <html>/<head>/<body> här längre — de flyttade till
 * src/app/layout.tsx (rot-layouten). Anledning: utan middleware (krävs
 * inte med statisk GitHub Pages-export) måste rot-layouten kunna
 * rendera "/"-sidan på egen hand, och en React-sida får bara ha EN
 * <html>-tagg totalt. <link>-taggarna nedan hoistas ändå automatiskt
 * till <head> av Next.js även utan ett explicit <head>-element runt dem
 * — det är standardbeteende i App Router för title/meta/link/script.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  // Sätt NEXT_PUBLIC_SITE_URL till din riktiga GitHub Pages-URL
  // (t.ex. https://ditt-namn.github.io/skate-event-calendar), annars
  // faller sitemap/OG-taggar tillbaka på denna platshållare.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.github.io/skate-event-calendar';
  const pageUrl = `${siteUrl}/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('siteTitle'),
      template: `%s · ${t('siteName')}`
    },
    description: t('siteDescription'),
    manifest: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/manifest.webmanifest`,
    openGraph: {
      title: t('siteTitle'),
      description: t('siteDescription'),
      url: pageUrl,
      siteName: t('siteName'),
      type: 'website',
      locale,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: t('siteName') }]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('siteTitle'),
      description: t('siteDescription'),
      images: ['/og-image.png']
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        'x-default': '/en'
      }
    }
  };
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#101012' },
    { media: '(prefers-color-scheme: light)', color: '#edeae2' }
  ]
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- regeln gäller Pages Router; vi använder App Router där detta är rätt mönster */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
      />
      <SetHtmlLang locale={locale} />
      <ThemeProvider>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </ThemeProvider>
    </>
  );
}
