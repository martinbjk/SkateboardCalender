import { useTranslations } from 'next-intl';
import { Github, Instagram, Youtube } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations();
  return (
    <footer className="mt-24 border-t border-asphalt-700/20 dark:border-chalk-500/15">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg tracking-tight">{t('meta.siteTitle')}</p>
            <p className="mt-1 max-w-sm text-sm text-chalk-500">{t('footer.tagline')}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-chalk-500 hover:text-spray"
              aria-label={t('footer.github')}
            >
              <Github size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-chalk-500 hover:text-spray"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-chalk-500 hover:text-spray"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-asphalt-700/15 pt-6 text-xs text-chalk-500 sm:flex-row sm:items-center sm:justify-between dark:border-chalk-500/10">
          <p>{t('footer.rights')}</p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono-tight uppercase tracking-wide">
            <Link href="/about" className="hover:text-spray">
              {t('about.title')}
            </Link>
            <Link href="/contact" className="hover:text-spray">
              {t('contact.title')}
            </Link>
            <Link href="/privacy" className="hover:text-spray">
              {t('privacy.title')}
            </Link>
            <Link href="/submit" className="hover:text-spray">
              {t('footer.submitEvent')} →
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
