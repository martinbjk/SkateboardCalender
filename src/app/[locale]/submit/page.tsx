import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Github, GitPullRequest } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'submit' });
  return { title: t('title') };
}

 const REPO_URL = 'https://github.com/martinbjk/SkateboardCalender';

export default async function SubmitPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'submit' });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">{t('title')}</h1>
      <p className="mt-3 text-asphalt-800/80 dark:text-chalk-300/80">{t('intro')}</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-stamp border border-asphalt-700/25 p-5 dark:border-chalk-500/20">
          <div className="flex items-center gap-2">
            <Github size={18} className="text-spray" />
            <h2 className="font-display text-lg tracking-tight">{t('issueTitle')}</h2>
          </div>
          <p className="mt-2 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('issueBody')}</p>
          <a
            href={`${REPO_URL}/issues/new?template=event_submission.yml`}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 rounded-stamp bg-spray px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide text-asphalt-950 hover:bg-spray-dark"
          >
            {t('issueCta')}
          </a>
        </div>

        <div className="rounded-stamp border border-asphalt-700/25 p-5 dark:border-chalk-500/20">
          <div className="flex items-center gap-2">
            <GitPullRequest size={18} className="text-spray" />
            <h2 className="font-display text-lg tracking-tight">{t('prTitle')}</h2>
          </div>
          <p className="mt-2 text-sm text-asphalt-800/80 dark:text-chalk-300/80">{t('prBody')}</p>
          <a
            href={`${REPO_URL}/tree/main/data/events`}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 rounded-stamp border border-asphalt-700/30 px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide hover:border-spray hover:text-spray dark:border-chalk-500/20"
          >
            {t('prCta')}
          </a>
        </div>
      </div>

      <p className="mt-6 text-xs text-chalk-500">{t('guidelines')}</p>
    </div>
  );
}
