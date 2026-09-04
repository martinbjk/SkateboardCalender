"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav/config";
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * FAST BOTTOM-NAV (YouTube/Amazon-stil)
 * ---------------------------------------------------------------
 * VIKTIGT — det här rör INTE er befintliga header. Headern (logga,
 * sök, vy-växlare) förblir exakt som den är idag. Det här är en
 * HELT NY, fristående rad längst ner på skärmen.
 *
 * Två flikar:
 *   - Hem  → länkar till "/" (kalendern)
 *   - Meny → öppnar en "bottom sheet" (panel som glider upp underifrån,
 *            samma mönster som Amazon-appens hamburgarmeny) med alla
 *            undersidor + platshållare för språk/tema
 *
 * KRÄVER EN ÅTGÄRD FRÅN ER: lägg padding-bottom på ert sidinnehåll
 * så att den fasta raden aldrig täcker sista eventkortet i kalendern
 * — se README-bottom-nav.md steg 3. Utan det ligger raden OVANPÅ
 * innehållet längst ner, vilket är exakt det ni inte ville.
 */
export default function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setSheetOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Låser bakgrundsscroll när menyn (bottom sheet) är öppen
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  return (
    <>
      {/* SJÄLVA FASTA RADEN */}
      <nav
        aria-label="Huvudmeny"
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }} // för iPhone-hemindikator
      >
        <Link
          href="/"
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs ${
            isHome ? "text-white" : "text-zinc-400"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
          </svg>
          Hem
        </Link>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Öppna meny"
          aria-expanded={sheetOpen}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs text-zinc-400"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Meny
        </button>
      </nav>

      {/* BOTTOM SHEET — glider upp underifrån när Meny trycks */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Stäng meny"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-zinc-800 bg-zinc-950 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <span className="text-sm font-semibold text-white">Meny</span>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Stäng"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <nav>
              <ul>
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                      className="block px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

           <div className="flex items-center gap-3 border-t border-zinc-800 px-4 py-3">
  <LanguageSwitcher />
  <ThemeToggle />
</div>
          </div>
        </div>
      )}
    </>
  );
}
