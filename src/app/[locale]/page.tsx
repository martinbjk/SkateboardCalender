import { getAllEvents, getEventStatus } from '@/lib/events';
import { Hero } from '@/components/Hero';
import { EventsExplorer } from '@/components/EventsExplorer';

export default function HomePage() {
  const events = getAllEvents();
  // Frys "nu" till EN tidpunkt för hela sidladdningen och skicka ner den
  // som en fast sträng till klientkomponenterna. Annars räknar varje
  // komponent (EventCard, CalendarView) ut sin egen `new Date()` både på
  // servern (vid bygget) och i webbläsaren (vid hydrering) — två olika
  // tidpunkter — vilket kan få ett events status (Live/Kommande/Avslutat)
  // att skilja sig mellan serverrenderad HTML och klienten. Resultatet blir
  // ett hydreringsfel i React som yttrar sig som text som blinkar till och
  // ändras direkt vid sidladdning.
  const now = new Date();
  const nowIso = now.toISOString();
  const liveCount = events.filter((e) => getEventStatus(e, now) === 'live').length;
  const upcomingCount = events.filter((e) => getEventStatus(e, now) === 'upcoming').length;

  return (
    <>
      <Hero liveCount={liveCount} upcomingCount={upcomingCount} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EventsExplorer events={events} now={nowIso} />
      </div>
    </>
  );
}
