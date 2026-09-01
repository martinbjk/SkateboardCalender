import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-40 border-b border-asphalt-700/20 bg-concrete-100/90 shadow-card backdrop-blur dark:border-chalk-500/15 dark:bg-asphalt-950/90 dark:shadow-card-dark">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center">
          {/* Egen 3D/graffiti-wordmark (tillhandahållen av Martin) i
              stället för den tidigare CSS-textloggan. Bakgrunden på
              originalbilden var INTE riktigt transparent (ett ljusgrått
              rutmönster bakat in i pixlarna) — extraherad/beskuren
              separat innan den lades in här, annars hade en ful ljusgrå
              ruta synts runt loggan i mörkt läge. */}
          <Image
            src="/logo-wordmark.webp"
            alt={t('meta.siteName')}
            width={900}
            height={231}
            priority
            className="h-8 w-auto object-contain transition group-hover:opacity-90 sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-6 font-mono-tight text-xs uppercase tracking-wide sm:flex">
          <Link href="/" className="hover:text-spray">
            {t('nav.home')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {/* Alltid synlig på alla skärmstorlekar nu (tidigare bara på
              mobil, med en osynkad ren textlänk på desktop) — en enda
              konsekvent, tydligt klickbar knapp överallt istället. */}
          <Link
            href="/submit"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-stamp bg-gradient-to-b from-spray-light to-spray px-3 py-2 font-mono-tight text-xs font-bold uppercase tracking-wide text-asphalt-950 shadow-md transition hover:shadow-lg active:translate-y-px active:shadow-sm"
          >
            <Plus size={14} strokeWidth={3} />
            <span className="sm:hidden">{t('nav.submitShort')}</span>
            <span className="hidden sm:inline">{t('nav.submit')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
