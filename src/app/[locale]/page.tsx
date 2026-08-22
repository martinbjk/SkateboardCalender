import { getAllEvents } from '@/lib/events';
import { Hero } from '@/components/Hero';
import { EventsExplorer } from '@/components/EventsExplorer';

export default function HomePage() {
  const events = getAllEvents();
  // Frys "nu" till EN tidpunkt vid byggtillfället och skicka ner den som
  // en fast sträng till klientkomponenterna (Hero, EventCard, CalendarView).
  // De använder alla `useLiveNow` (src/lib/useLiveNow.ts) för att undvika
  // ett hydreringsfel vid första renderingen, och uppdaterar sedan till
  // riktig aktuell tid strax efter sidladdning — annars hade Live/Kommande-
  // status bara uppdaterats vid nästa bygge/commit istället för i realtid.
  const nowIso = new Date().toISOString();

  return (
    <>
      <Hero events={events} now={nowIso} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EventsExplorer events={events} now={nowIso} />
      </div>
    </>
  );
}
