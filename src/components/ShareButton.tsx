'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Share2, Check } from 'lucide-react';

/**
 * Delaknapp för eventsidor. Använder native Web Share API (öppnar
 * telefonens/OS:ets egen delningsmeny — Instagram, WhatsApp, SMS osv)
 * där det stöds, annars faller den tillbaka på att kopiera länken till
 * urklipp med en kort "kopierat"-bekräftelse. Skrivbordswebbläsare
 * saknar oftast navigator.share, så fallback är det vanliga läget där.
 */
export function ShareButton({ url, title }: { url: string; title: string }) {
  const t = useTranslations('event');
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Användaren avbröt delningsdialogen eller den nekades — inget att göra
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard-API otillgängligt (t.ex. icke-säker kontext) — inget att göra
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-stamp border border-asphalt-700/30 px-4 py-2.5 font-mono-tight text-xs font-bold uppercase tracking-wide transition hover:border-spray hover:text-spray dark:border-chalk-500/20"
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? t('linkCopied') : t('share')}
    </button>
  );
}
