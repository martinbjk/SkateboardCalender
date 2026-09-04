import Image from "next/image";

/**
 * TILLFÄLLIG TEST-SIDA — syftet just nu är bara att bekräfta att
 * routen /articles fungerar överhuvudtaget innan den riktiga
 * artikel-listan/markdown-systemet kopplas in. Ingen data hämtas,
 * ingen översättning behövs (texten är inbakad i själva bilden).
 *
 * NÄR NI ÄR REDO FÖR RIKTIGA ARTIKLAR: ersätt hela innehållet i den
 * här filen med er faktiska artikel-lista (den som läser från
 * content/articles/{sv,en}/*.md).
 */
export default function ArticlesPage() {
  return (
    <div className="flex justify-center bg-black">
      <Image
        src="/articles-coming-soon.webp"
        alt="New media & articles coming soon"
        width={941}
        height={1672}
        priority
        className="h-auto w-full max-w-md"
      />
    </div>
  );
}
