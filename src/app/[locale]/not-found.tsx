import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="stamp -rotate-3 bg-hazard px-3 py-1.5 font-display text-sm text-asphalt-950">
        404
      </span>
      <h1 className="font-display mt-4 text-3xl tracking-tight">{t('title')}</h1>
      <p className="mt-2 text-chalk-500">{t('body')}</p>
      <Link
        href="/"
        className="mt-6 rounded-stamp bg-spray px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide text-asphalt-950 hover:bg-spray-dark"
      >
        {t('cta')}
      </Link>
    </div>
  );
}
