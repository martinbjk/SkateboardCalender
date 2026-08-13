'use client';

import { useEffect } from 'react';

/**
 * Sätter <html lang="..."> från klienten. Behövs eftersom rot-layouten
 * (som äger <html>-taggen) inte vet vilket språk som är aktivt — bara
 * /[locale]/layout.tsx gör det, och den ligger ett steg för långt in i
 * trädet för att kunna ändra en attribut på ett förfaderselement under
 * server-rendering. Kosmetiskt/SEO-attribut, påverkar inte funktionalitet.
 */
export function SetHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
