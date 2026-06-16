'use client';

import { useMemo } from 'react';

const DAY_MS = 1000 * 60 * 60 * 24;

export function GanttChart({ tracks }: { tracks: any[] }) {
  const { minDate, maxDate } = useMemo(() => {
    let min = new Date().getTime() - 15 * DAY_MS;
    let max = new Date().getTime() + 45 * DAY_MS;

    tracks.forEach(track => {
      const dates = [
        track.compStartDate, track.compEndDate,
        track.rehStartDate, track.rehEndDate,
        track.recStartDate, track.recEndDate
      ].filter(Boolean).map(d => new Date(d).getTime());

      if (dates.length > 0) {
        min = Math.min(min, ...dates);
        max = Math.max(max, ...dates);
      }
    });

    return {
      minDate: new Date(min - 5 * DAY_MS),
      maxDate: new Date(max + 5 * DAY_MS),
    };
  }, [tracks]);

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / DAY_MS);

  const getColSpan = (start: string | null, end: string | null) => {
    if (!start || !end) return null;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (s > maxDate.getTime() || e < minDate.getTime()) return null;

    let startCol = Math.floor((s - minDate.getTime()) / DAY_MS) + 1;
    let endCol = Math.ceil((e - minDate.getTime()) / DAY_MS) + 2; 

    startCol = Math.max(1, startCol);
    endCol = Math.min(totalDays + 1, endCol);

    if (startCol >= endCol) return null;
    return `${startCol} / ${endCol}`;
  };

  const days = Array.from({ length: totalDays }, (_, i) => new Date(minDate.getTime() + i * DAY_MS));
  
  const months: { label: string, span: number }[] = [];
  let currentMonth = -1;
  days.forEach(day => {
    if (day.getMonth() !== currentMonth) {
      months.push({ label: day.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }), span: 1 });
      currentMonth = day.getMonth();
    } else {
      months[months.length - 1].span += 1;
    }
  });

  const hasTracksWithDates = tracks.some(t => getColSpan(t.compStartDate, t.compEndDate) || getColSpan(t.rehStartDate, t.rehEndDate) || getColSpan(t.recStartDate, t.recEndDate));

  return (
    <div className="overflow-x-auto pb-8 rounded-xl bg-slate-900/50 border border-slate-800 p-6 shadow-xl">
      <div className="min-w-[800px]">
        {/* Timeline Header */}
        <div className="flex ml-48 border-b border-slate-800">
          {months.map((m, i) => (
            <div key={i} className="text-center text-sm font-semibold text-slate-400 py-2 border-r border-slate-800/50" style={{ width: `${(m.span / totalDays) * 100}%` }}>
              {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
            </div>
          ))}
        </div>

        {/* Tracks Grid */}
        <div className="mt-4 space-y-4">
          {tracks.map(track => {
            const compSpan = getColSpan(track.compStartDate, track.compEndDate);
            const rehSpan = getColSpan(track.rehStartDate, track.rehEndDate);
            const recSpan = getColSpan(track.recStartDate, track.recEndDate);

            if (!compSpan && !rehSpan && !recSpan) return null;

            return (
              <div key={track.id} className="flex group h-12">
                <div className="w-48 shrink-0 pr-4 flex items-center">
                  <h3 className="text-slate-200 font-medium truncate group-hover:text-emerald-400 transition-colors">{track.name}</h3>
                </div>
                <div 
                  className="flex-1 relative bg-slate-800/30 rounded-lg border border-slate-800/50 overflow-hidden" 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` 
                  }}
                >
                  {/* Background grid lines */}
                  <div className="col-start-1 col-end-[-1] row-start-1 flex h-full pointer-events-none">
                     {months.map((m, i) => (
                       <div key={i} className="border-r border-slate-800/30 h-full" style={{ width: `${(m.span / totalDays) * 100}%` }} />
                     ))}
                  </div>

                  {/* Stage bars */}
                  {compSpan && (
                    <div 
                      className="absolute top-1.5 bottom-1.5 rounded-md bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs text-blue-300 font-medium whitespace-nowrap overflow-hidden hover:bg-blue-500/30 hover:scale-[1.02] hover:z-10 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                      style={{ gridColumn: compSpan }}
                      title={`Сочинение: ${new Date(track.compStartDate).toLocaleDateString('ru-RU')} - ${new Date(track.compEndDate).toLocaleDateString('ru-RU')}`}
                    >
                      <span className="px-2 truncate">Сочинение</span>
                    </div>
                  )}
                  {rehSpan && (
                    <div 
                      className="absolute top-1.5 bottom-1.5 rounded-md bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-xs text-amber-300 font-medium whitespace-nowrap overflow-hidden hover:bg-amber-500/30 hover:scale-[1.02] hover:z-10 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                      style={{ gridColumn: rehSpan }}
                      title={`Репетиции: ${new Date(track.rehStartDate).toLocaleDateString('ru-RU')} - ${new Date(track.rehEndDate).toLocaleDateString('ru-RU')}`}
                    >
                      <span className="px-2 truncate">Репетиции</span>
                    </div>
                  )}
                  {recSpan && (
                    <div 
                      className="absolute top-1.5 bottom-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-xs text-emerald-300 font-medium whitespace-nowrap overflow-hidden hover:bg-emerald-500/30 hover:scale-[1.02] hover:z-10 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                      style={{ gridColumn: recSpan }}
                      title={`Запись: ${new Date(track.recStartDate).toLocaleDateString('ru-RU')} - ${new Date(track.recEndDate).toLocaleDateString('ru-RU')}`}
                    >
                      <span className="px-2 truncate">Запись</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {!hasTracksWithDates && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Нет треков с заданными сроками (таймлайном).</p>
              <p className="text-sm mt-1">Отредактируйте трек или создайте новый и укажите сроки стадий.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
