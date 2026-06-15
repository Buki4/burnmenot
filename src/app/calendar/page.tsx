import prisma from '@/lib/prisma';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import { EventCard } from '@/components/EventCard';

export const dynamic = 'force-dynamic';
import { EventModal } from '@/components/EventModal';

export default async function CalendarPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <RealtimeRefresher />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Календарь</h1>
        <EventModal />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1">
        <ul className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {events.length === 0 && <p className="text-slate-500">Нет запланированных событий.</p>}
        </ul>
      </div>
    </div>
  );
}
