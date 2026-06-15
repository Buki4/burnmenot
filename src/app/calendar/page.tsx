import prisma from '@/lib/prisma';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';

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
          {events.map((event) => {
            const isPast = event.date < new Date();
            return (
              <li key={event.id} className={`flex items-center justify-between p-4 rounded-xl border ${isPast ? 'border-slate-800 opacity-50 bg-slate-950' : 'border-emerald-500/30 bg-slate-800 hover:bg-slate-750 transition-colors'}`}>
                <div>
                  <h3 className="text-xl font-semibold text-slate-200">{event.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full', timeStyle: 'short' }).format(event.date)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPast ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                  {event.type}
                </span>
              </li>
            );
          })}
          {events.length === 0 && <p className="text-slate-500">Нет запланированных событий.</p>}
        </ul>
      </div>
    </div>
  );
}
