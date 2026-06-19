'use client';

import { useState } from 'react';
import { EventModal } from './EventModal';

function getDaysInMonthGrid(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  
  // 0 = Sun, 1 = Mon. Convert to Mon=0 ... Sun=6
  let firstDayOfWeek = date.getDay() - 1;
  if (firstDayOfWeek === -1) firstDayOfWeek = 6;
  
  // Prev month padding
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
  }
  
  // Current month
  const currentMonthDays = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= currentMonthDays; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  
  // Next month padding (total 42 cells)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }
  
  return days;
}

const getEventColor = (type: string) => {
  switch (type) {
    case 'Gig': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Rehearsal': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Recording': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Shooting': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Hangout': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};

export function MonthlyCalendar({ events }: { events: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<any | undefined>();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const daysGrid = getDaysInMonthGrid(year, month);
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const monthName = currentDate.toLocaleString('ru-RU', { month: 'long' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const handleDayClick = (dateObj: Date) => {
    // Format YYYY-MM-DD in local time
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
    setSelectedEvent(undefined);
    setModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-100 w-48">
            {capitalizedMonth} <span className="text-slate-500 font-medium">{year}</span>
          </h2>
          <button onClick={handleToday} className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
            Сегодня
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors border border-slate-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors border border-slate-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-800/20 shrink-0">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {daysGrid.map((dayObj, i) => {
          // Normalize to midnight for local comparison
          const cellDate = new Date(dayObj.date.getFullYear(), dayObj.date.getMonth(), dayObj.date.getDate()).getTime();
          const today = new Date();
          const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
          const isToday = cellDate === todayNormalized;

          // Find events for this day
          const dayEvents = events.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getFullYear() === dayObj.date.getFullYear() &&
                   eDate.getMonth() === dayObj.date.getMonth() &&
                   eDate.getDate() === dayObj.date.getDate();
          }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          return (
            <div 
              key={i} 
              onClick={() => handleDayClick(dayObj.date)}
              className={`min-h-[80px] md:min-h-[100px] border-b border-r border-slate-800 p-1.5 md:p-2 cursor-pointer transition-colors group relative overflow-y-auto custom-scrollbar
                ${dayObj.isCurrentMonth ? 'bg-transparent hover:bg-slate-800/50' : 'bg-slate-900/50 hover:bg-slate-800/30'}
                ${i % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                    dayObj.isCurrentMonth ? 'text-slate-300 group-hover:text-white' : 'text-slate-600'}
                `}>
                  {dayObj.date.getDate()}
                </span>
              </div>
              
              <div className="space-y-1 mt-1">
                {dayEvents.map(event => {
                  const eventTime = new Date(event.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div 
                      key={event.id}
                      onClick={(e) => handleEventClick(e, event)}
                      className={`text-xs px-1.5 md:px-2 py-1 rounded-md border flex items-center gap-1.5 truncate cursor-pointer hover:brightness-110 transition-all ${getEventColor(event.type)}`}
                      title={`${eventTime} - ${event.title}`}
                    >
                      <span className="text-[10px] opacity-75 shrink-0 hidden md:inline">{eventTime}</span>
                      <span className="truncate font-medium">{event.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <EventModal 
        isOpenProp={modalOpen} 
        onClose={() => setModalOpen(false)} 
        defaultDate={selectedDate}
        eventToEdit={selectedEvent}
        hideTrigger={true}
      />
    </div>
  );
}
