import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Github } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title') };
}

const REPO_URL = 'https://github.com/martinbjk/SkateboardCalender';

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">{t('title')}</h1>
      <p className="mt-3 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('intro')}</p>

      <div className="mt-8 rounded-stamp border border-asphalt-700/25 p-5 dark:border-chalk-500/20">
        <div className="flex items-center gap-2">
          <Github size={18} className="text-spray" />
          <h2 className="font-display text-lg tracking-tight">{t('issuesTitle')}</h2>
        </div>
        <p className="mt-2 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('issuesBody')}</p>
        <a
          href={`${REPO_URL}/issues/new`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-2 rounded-stamp bg-spray px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide text-asphalt-950 hover:bg-spray-dark"
        >
          {t('issuesCta')}
        </a>
      </div>

      <p className="mt-6 text-xs text-chalk-500">{t('responseTime')}</p>
    </div>
  );
}
