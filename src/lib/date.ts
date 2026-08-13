import type { SkateEvent } from './schema';

export function formatDateRange(event: SkateEvent, locale: string): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const sameDay = start.toDateString() === end.toDateString();

  const dayFmt = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: event.timezone
  });
  const yearFmt = new Intl.DateTimeFormat(locale, { year: 'numeric', timeZone: event.timezone });

  if (sameDay) {
    return `${dayFmt.format(start)} ${yearFmt.format(start)}`;
  }
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  if (sameMonth) {
    const startDay = new Intl.DateTimeFormat(locale, { day: 'numeric', timeZone: event.timezone }).format(
      start
    );
    return `${startDay}–${dayFmt.format(end)} ${yearFmt.format(end)}`;
  }
  return `${dayFmt.format(start)} – ${dayFmt.format(end)} ${yearFmt.format(end)}`;
}

export function formatTime(dateStr: string, timezone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone
  }).format(new Date(dateStr));
}

function toIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function buildIcs(event: SkateEvent): string {
  const uid = `${event.slug}@skate-event-calendar`;
  const now = toIcsDate(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Skate Event Calendar//SV',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toIcsDate(new Date(event.startDate))}`,
    `DTEND:${toIcsDate(new Date(event.endDate))}`,
    `SUMMARY:${escapeIcs(event.name)}`,
    `LOCATION:${escapeIcs(`${event.location.venue}, ${event.location.city}, ${event.location.country}`)}`,
    `DESCRIPTION:${escapeIcs(event.description.en)}`,
    event.officialUrl ? `URL:${event.officialUrl}` : undefined,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean);
  return lines.join('\r\n');
}

function escapeIcs(text: string): string {
  return text.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
}

export function buildGoogleCalendarUrl(event: SkateEvent): string {
  const fmt = (d: string) => toIcsDate(new Date(d));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${fmt(event.startDate)}/${fmt(event.endDate)}`,
    details: event.description.en,
    location: `${event.location.venue}, ${event.location.city}, ${event.location.country}`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
