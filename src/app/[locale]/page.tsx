import { getAllEvents, getEventStatus } from '@/lib/events';
import { Hero } from '@/components/Hero';
import { EventsExplorer } from '@/components/EventsExplorer';

export default function HomePage() {
  const events = getAllEvents();
  const liveCount = events.filter((e) => getEventStatus(e) === 'live').length;
  const upcomingCount = events.filter((e) => getEventStatus(e) === 'upcoming').length;

  return (
    <>
      <Hero liveCount={liveCount} upcomingCount={upcomingCount} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EventsExplorer events={events} />
      </div>
    </>
  );
}
