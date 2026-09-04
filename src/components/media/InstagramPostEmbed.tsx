"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  url: string;
  caption?: string;
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Använder Instagrams EGEN officiella embed (blockquote + embed.js) för
 * ETT specifikt publikt inlägg — det är den enda typ av Instagram-
 * inbäddning som funkar utan API-token/inlogg, och är därför lämplig
 * här (kuraterat enskilt inlägg per artikel), till skillnad från ett
 * "live-flöde från flera konton" som INTE går utan token (se
 * config.ts-kommentaren från media-sidan för den bakgrunden).
 *
 * Laddas bara in (script + process()) när kortet är nära synligt i
 * viewporten, så artikelsidan inte drar ner Instagrams script i onödan
 * om läsaren aldrig scrollar dit.
 */
export default function InstagramPostEmbed({ url, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    // embed.js kör process() automatiskt vid load, ingen extra kod behövs
  }, [shouldLoad]);

  return (
    <figure ref={ref} className="overflow-hidden rounded-xl">
      {shouldLoad ? (
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ margin: 0, width: "100%" }}
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500">
          Instagram-inlägg
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-sm text-zinc-400">{caption}</figcaption>
      )}
    </figure>
  );
}
