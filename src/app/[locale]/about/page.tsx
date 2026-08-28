import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Github } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

const REPO_URL = 'https://github.com/martinbjk/SkateboardCalender';

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">{t('title')}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-asphalt-800/90 dark:text-chalk-300/90">
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <p>{t('p3')}</p>
      </div>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-6 inline-flex items-center gap-2 rounded-stamp border border-asphalt-700/30 px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide hover:border-spray hover:text-spray dark:border-chalk-500/20"
      >
        <Github size={16} />
        {t('githubCta')}
      </a>
    </div>
  );
}
