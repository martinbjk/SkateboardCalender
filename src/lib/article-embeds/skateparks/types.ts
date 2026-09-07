/**
 * Strukturen för en verifierad inomhuspark, extraherad ur
 * content/articles/en/verified-indoor-skateparks-world.md av
 * scripts/extract-skateparks.ts. Varje post har verifierad adress/sajt/
 * e-post — till skillnad från "More Swedish indoor halls"-tabellen, som
 * lämnas kvar som vanlig artikeltext.
 */

export type SkateparkRegion = 'Europe' | 'North America & Mexico' | 'Asia' | 'Oceania';

export interface Skatepark {
  /** slug av namnet, unikt inom listan — används som React-key */
  id: string;
  name: string;
  /** rå platssträng ur rubriken, t.ex. "Aintree, Liverpool, UK" — sökbar */
  location: string;
  /** första kommadelen av location, null om ingen komma finns */
  city: string | null;
  /** sista kommadelen av location */
  country: string;
  region: SkateparkRegion;
  description: string | null;
  /** rå text efter 📍 — 0–2 rader (2 = flera lägen) */
  addresses: string[];
  /** rå värde efter 🌐 — oftast en domän, ibland "Facebook: …" */
  website: string | null;
  email: string | null;
  /** rå text efter ⚠️ — stängnings-/statusnot eller förbehåll */
  warning: string | null;
}
