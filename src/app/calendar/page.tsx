'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { EventModal } from '@/components/EventModal';
import { MonthlyCalendar } from '@/components/MonthlyCalendar';

export default function CalendarPage() {
  const { data: events } = useSWR('/api/events', fetcher);

  if (!events) {
    return (
      <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-medium animate-pulse">Загрузка календаря...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Календарь</h1>
          <p className="text-slate-400 mt-2">Расписание репетиций, концертов и съемок</p>
        </div>
        <EventModal />
      </div>

      <div className="flex-1 min-h-[600px]">
        <MonthlyCalendar events={events} />
      </div>
    </div>
  );
}
