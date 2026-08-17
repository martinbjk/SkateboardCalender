import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-40 border-b border-asphalt-700/20 bg-concrete-100/85 backdrop-blur dark:border-chalk-500/15 dark:bg-asphalt-950/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="stamp -rotate-3 bg-spray px-2 py-1 font-display text-sm text-asphalt-950">
            SEC
          </span>
          <span className="font-display text-lg tracking-tight group-hover:text-spray">
            {t('meta.siteName')}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-mono-tight text-xs uppercase tracking-wide sm:flex">
          <Link href="/" className="hover:text-spray">
            {t('nav.home')}
          </Link>
          <Link href="/submit" className="hover:text-spray">
            {t('nav.submit')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Alltid synlig, även på mobil — texten i <nav> ovan är dold under
              sm-brytpunkten, så utan den här skulle "Föreslå event" bara
              nås via den lilla länken i footern. */}
          <Link
            href="/submit"
            className="flex items-center gap-1.5 rounded-stamp bg-spray px-2.5 py-1.5 font-mono-tight text-xs font-bold uppercase tracking-wide text-asphalt-950 hover:bg-spray-dark sm:hidden"
          >
            <Plus size={14} />
            {t('nav.submit')}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
