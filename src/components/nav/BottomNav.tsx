"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav/config";

/**
 * FAST BOTTOM-NAV (YouTube/Amazon-stil) — bara ikoner, ingen text
 * ---------------------------------------------------------------
 * VIKTIGT — det här rör INTE er befintliga header. Språk/tema hanteras
 * INTE här längre (borttaget medvetet) — det finns redan i toppmenyn,
 * och att duplicera det här gav bara en färgkrock (den här panelen är
 * hårdkodad mörk, medan LanguageSwitcher/ThemeToggle följer sajtens
 * riktiga ljust/mörkt-tema).
 *
 * SPRÅK: Link/usePathname kommer från @/i18n/navigation (samma som
 * Footer.tsx använder) — INTE next/link eller next/navigation.
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

      {/* BOTTOM SHEET — bara sidlänkar, inget språk/tema */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Stäng meny"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="absolute inset-x-0 bottom-0 flex max-h-[75vh] flex-col rounded-t-2xl border-t border-zinc-800 bg-zinc-950 pb-[env(safe-area-inset-bottom)]">
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3">
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

            <nav className="overflow-y-auto">
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
          </div>
        </div>
      )}
    </>
  );
}
