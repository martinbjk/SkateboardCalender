"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav/config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * FAST BOTTOM-NAV (YouTube/Amazon-stil) — bara ikoner, ingen text
 * ---------------------------------------------------------------
 * VIKTIGT — det här rör INTE er befintliga header. Headern (logga,
 * sök, vy-växlare) förblir exakt som den är idag. Det här är en
 * HELT NY, fristående rad längst ner på skärmen.
 *
 * INGEN SYNLIG TEXT i själva raden (bara ikoner, samma som Amazon-
 * appen) — men aria-label finns kvar på båda knapparna, översatt via
 * er befintliga nav.home-nyckel, så skärmläsare fortfarande får rätt
 * ord på rätt språk. Det löser också "Meny"-textens
 * översättningsproblem helt, eftersom ordet aldrig visas.
 *
 * SPRÅK: Link/usePathname kommer från @/i18n/navigation (samma som
 * Footer.tsx och LanguageSwitcher.tsx använder) — INTE next/link eller
 * next/navigation.
 *
 * Sidnamnen INUTI menyn (Discipliner, Historia osv, i bottom sheet-
 * panelen) har fortfarande synlig text och använder BEFINTLIGA
 * next-intl-nycklar, samma som Footer.tsx.
 *
 * HÖJD: h-12 (48px) — Apple/Google rekommenderar minst ~44px
 * touch-yta, så detta är den smalaste rimliga höjden utan att bli
 * svår att trycka på. Om ni vill ännu smalare, säg till.
 */
export default function BottomNav() {
  const t = useTranslations();
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

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  return (
    <>
      {/* SJÄLVA FASTA RADEN — bara ikoner, h-12 (48px) */}
      <nav
        aria-label="Huvudmeny"
        className="fixed inset-x-0 bottom-0 z-40 flex h-12 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Link
          href="/"
          aria-label={t("nav.home")}
          className={`flex flex-1 items-center justify-center ${
            isHome ? "text-white" : "text-zinc-400"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
          </svg>
        </Link>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Öppna meny"
          aria-expanded={sheetOpen}
          className="flex flex-1 items-center justify-center text-zinc-400"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* BOTTOM SHEET — glider upp underifrån när Meny trycks. Har
          synlig text för sidnamnen, det är bara den FASTA raden ovan
          som är ikon-only. */}
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
                      {t(item.translationKey)}
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
