'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { EventCard } from '@/components/EventCard';
import { EventModal } from '@/components/EventModal';

export default function CalendarPage() {
  const { data: events } = useSWR('/api/events', fetcher);

  if (!events) {
    return (
      <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-medium animate-pulse">Синхронизация...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Календарь</h1>
        <EventModal />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1">
        <ul className="space-y-4">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
          {events.length === 0 && <p className="text-slate-500">Нет запланированных событий.</p>}
        </ul>
      </div>
    </div>
  );
}
