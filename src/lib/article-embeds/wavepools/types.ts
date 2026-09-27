/**
 * Strukturen för en verifierad wave pool i wave-pools-artikeln. Till
 * skillnad från skatepark-listan är den här datan handskriven, inte
 * extraherad ur markdown — listan är kort nog (~18 anläggningar) att hålla
 * synkad för hand, och undviker att bygga en extraktions-pipeline för en
 * enda artikel.
 */

export type WavePoolRegion =
  | 'North America'
  | 'South America'
  | 'Europe'
  | 'Middle East'
  | 'Asia'
  | 'Oceania';

export interface WavePool {
  /** slug av namnet, unikt inom listan — används som React-key */
  id: string;
  name: string;
  /** "Stad, Land" eller "Stad, delstat, Land" — sökbar */
  location: string;
  city: string;
  country: string;
  region: WavePoolRegion;
  /** Tillverkare/teknik, t.ex. "Wavegarden Cove" — null om inte offentligt bekräftad */
  technology: string | null;
  /** Kort beskrivning av vilka svårighetsgrader/vågtyper som erbjuds */
  difficulty: string;
  description: string;
  /** Ren domän (utan https://), t.ex. "wavegarden.com" */
  website: string;
  /** Full URL till bokning/prissida — vi listar aldrig priser i klartext, bara länken dit */
  bookingUrl: string;
  /** Åtkomstbegränsning eller annan viktig brasklapp, t.ex. "Invite/event access only" */
  note: string | null;
}
