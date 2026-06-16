'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

const DAY_MS = 1000 * 60 * 60 * 24;

const addDays = (dateStr: string, days: number) => {
  const d = new Date(dateStr);
  const time = d.getTime() + days * DAY_MS;
  return new Date(time).toISOString().split('T')[0];
};

function DraggableTrackRow({ track, minDate, maxDate, totalDays, months, onEditTrack }: any) {
  const [stages, setStages] = useState(track.stages || []);
  const rowRef = useRef<HTMLDivElement>(null);
  const { mutate } = useSWRConfig();
  
  const [dragInfo, setDragInfo] = useState<any>(null);
  const [deltaDays, setDeltaDays] = useState(0);

  useEffect(() => {
    if (!dragInfo) setStages(track.stages || []);
  }, [track.stages, dragInfo]);

  const displayStages = useMemo(() => {
    if (!dragInfo || deltaDays === 0) return stages;
    
    const newStages = JSON.parse(JSON.stringify(dragInfo.initialStages));
    const idx = dragInfo.index;
    
    if (dragInfo.type === 'right') {
      newStages[idx].endDate = addDays(newStages[idx].endDate, deltaDays);
      for (let k = idx + 1; k < newStages.length; k++) {
        newStages[k].startDate = addDays(newStages[k].startDate, deltaDays);
        newStages[k].endDate = addDays(newStages[k].endDate, deltaDays);
      }
    } else if (dragInfo.type === 'left') {
      newStages[idx].startDate = addDays(newStages[idx].startDate, deltaDays);
      if (idx > 0) {
        newStages[idx - 1].endDate = addDays(newStages[idx - 1].endDate, deltaDays);
      }
    } else if (dragInfo.type === 'body') {
      if (idx > 0) {
        newStages[idx - 1].endDate = addDays(newStages[idx - 1].endDate, deltaDays);
      }
      for (let k = idx; k < newStages.length; k++) {
        newStages[k].startDate = addDays(newStages[k].startDate, deltaDays);
        newStages[k].endDate = addDays(newStages[k].endDate, deltaDays);
      }
    }

    let isValid = true;
    for (const s of newStages) {
      if (s.startDate && s.endDate && new Date(s.startDate).getTime() > new Date(s.endDate).getTime()) {
        isValid = false;
      }
    }
    
    if (isValid) dragInfo.lastValidStages = newStages;
    return dragInfo.lastValidStages || dragInfo.initialStages;
  }, [stages, dragInfo, deltaDays]);

  const displayStagesRef = useRef(displayStages);
  useEffect(() => {
    displayStagesRef.current = displayStages;
  }, [displayStages]);

  const handlePointerDown = (e: React.PointerEvent, index: number, type: 'left' | 'right' | 'body') => {
    // DO NOT use e.preventDefault() here as it breaks pointermove on many browsers
    e.stopPropagation();
    if (!rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const pixelsPerDay = rect.width / totalDays;
    
    setDragInfo({
      index,
      type,
      startX: e.clientX,
      pixelsPerDay: pixelsPerDay || 10,
      initialStages: JSON.parse(JSON.stringify(stages)),
      lastValidStages: JSON.parse(JSON.stringify(stages))
    });

    document.body.style.cursor = type === 'body' ? 'grabbing' : 'col-resize';
  };

  useEffect(() => {
    if (!dragInfo) return;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - dragInfo.startX;
      const days = Math.round(deltaX / dragInfo.pixelsPerDay);
      setDeltaDays(days);
    };

    const handlePointerUp = async () => {
      document.body.style.cursor = '';
      const finalStages = displayStagesRef.current;
      const initial = dragInfo.initialStages;
      
      setDragInfo(null);
      setDeltaDays(0);
      setStages(finalStages);

      if (JSON.stringify(finalStages) === JSON.stringify(initial)) return;

      const savePromise = fetch(`/api/tracks/${track.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: track.name,
          status: track.status,
          stages: finalStages.map((s: any, i: number) => ({
            name: s.name,
            color: s.color,
            startDate: s.startDate,
            endDate: s.endDate,
            order: i
          }))
        })
      }).then(res => {
        if (!res.ok) throw new Error('Network error');
        mutate('/api/tracks');
      });

      toast.promise(savePromise, {
        loading: 'Сохранение сроков...',
        success: 'Сроки успешно обновлены!',
        error: 'Ошибка сохранения'
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = '';
    };
  }, [dragInfo, track.id, track.name, track.status, mutate]);

  const getColSpan = (start: string | null, end: string | null) => {
    if (!start || !end) return null;
    
    const sObj = new Date(start);
    sObj.setHours(0, 0, 0, 0);
    const s = sObj.getTime();

    const eObj = new Date(end);
    eObj.setHours(0, 0, 0, 0);
    const e = eObj.getTime();

    const minT = minDate.getTime();
    if (s > maxDate.getTime() || e < minT) return null;

    let startCol = Math.round((s - minT) / DAY_MS) + 1;
    let endCol = Math.round((e - minT) / DAY_MS) + 1; 

    startCol = Math.max(1, startCol);
    endCol = Math.min(totalDays + 1, endCol);

    if (startCol >= endCol) endCol = startCol + 1; // ensure at least 1 column

    return `${startCol} / ${endCol}`;
  };

  const validStages = displayStages.map((s: any) => ({ ...s, span: getColSpan(s.startDate, s.endDate) })).filter((s: any) => s.span);
  if (validStages.length === 0) return null;

  return (
    <div className="flex h-12 relative group/item">
      <div className="w-48 shrink-0 pr-4 flex items-center gap-2 sticky left-0 bg-[#0f172a] z-20 shadow-[4px_0_12px_rgba(0,0,0,0.5)] group-hover/item:bg-slate-800 transition-colors pl-2">
        <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 p-1 flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <h3 
          className="text-slate-200 font-medium truncate hover:text-emerald-400 transition-colors cursor-pointer flex-1"
          onClick={() => onEditTrack && onEditTrack(track)}
          title="Редактировать трек"
        >
          {track.name}
        </h3>
        <button 
          onClick={() => onEditTrack && onEditTrack(track)}
          className="text-slate-500 hover:text-emerald-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
          title="Редактировать"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
      <div 
        ref={rowRef}
        className="flex-1 relative bg-slate-800/30 rounded-lg border border-slate-800/50 overflow-hidden" 
        style={{ display: 'grid', gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}
      >
        <div className="col-start-1 col-end-[-1] row-start-1 flex h-full pointer-events-none">
           {months.map((m: any, i: number) => (
             <div key={i} className="border-r border-slate-800/30 h-full" style={{ width: `${(m.span / totalDays) * 100}%` }} />
           ))}
        </div>

        {validStages.map((stage: any, idx: number) => {
          const colorMap: Record<string, string> = {
            blue: 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30 shadow-blue-500/10',
            red: 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 shadow-red-500/10',
            orange: 'bg-orange-500/20 border-orange-500/50 text-orange-300 hover:bg-orange-500/30 shadow-orange-500/10',
            purple: 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 shadow-purple-500/10',
            pink: 'bg-pink-500/20 border-pink-500/50 text-pink-300 hover:bg-pink-500/30 shadow-pink-500/10',
            emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 shadow-emerald-500/10',
          };
          const colorClasses = colorMap[stage.color] || colorMap['emerald'];
          const isDraggingThis = dragInfo?.index === idx;

          return (
            <div 
              key={stage.id || stage.name}
              className={`relative row-start-1 h-9 my-auto rounded-md border flex items-center justify-center text-xs font-medium whitespace-nowrap overflow-visible transition-colors shadow-lg ${colorClasses} ${isDraggingThis ? 'z-20 scale-[1.02] bg-opacity-40' : 'hover:scale-[1.02] hover:z-10'}`}
              style={{ gridColumn: stage.span, userSelect: 'none', touchAction: 'pan-y' }}
              title={`${stage.name}: ${new Date(stage.startDate).toLocaleDateString('ru-RU')} - ${new Date(stage.endDate).toLocaleDateString('ru-RU')}`}
              onPointerDown={(e) => handlePointerDown(e, idx, 'body')}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/20 z-10 rounded-l-md"
                onPointerDown={(e) => handlePointerDown(e, idx, 'left')}
                style={{ touchAction: 'none' }}
              />
              <span className="px-3 truncate pointer-events-none">{stage.name}</span>
              <div 
                className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/20 z-10 rounded-r-md"
                onPointerDown={(e) => handlePointerDown(e, idx, 'right')}
                style={{ touchAction: 'none' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GanttChart({ tracks, onEditTrack }: { tracks: any[], onEditTrack?: (track: any) => void }) {
  const [orderedTracks, setOrderedTracks] = useState(tracks);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setOrderedTracks(tracks);
  }, [tracks]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    // Optional: make it look slightly transparent while dragging
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
    if (dragItem.current !== null && dragItem.current !== index) {
      const newList = [...orderedTracks];
      const item = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(index, 0, item);
      dragItem.current = index;
      setOrderedTracks(newList);
    }
  };

  const handleDragEnd = async () => {
    dragItem.current = null;
    dragOverItem.current = null;
    
    // Check if order actually changed by comparing IDs
    const currentOrder = orderedTracks.map(t => t.id).join(',');
    const initialOrder = tracks.map(t => t.id).join(',');
    
    if (currentOrder !== initialOrder) {
      const payload = orderedTracks.map((t, idx) => ({ id: t.id, order: idx }));
      
      const savePromise = fetch('/api/tracks/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks: payload })
      }).then(res => {
        if (!res.ok) throw new Error('Failed to reorder');
        mutate('/api/tracks');
      });

      toast.promise(savePromise, {
        loading: 'Сохранение порядка...',
        success: 'Порядок треков сохранен!',
        error: 'Ошибка при сохранении'
      });
    }
  };
  const { minDate, maxDate } = useMemo(() => {
    let min = new Date().getTime() - 15 * DAY_MS;
    let max = new Date().getTime() + 45 * DAY_MS;

    tracks.forEach(track => {
      if (track.stages && Array.isArray(track.stages)) {
        const dates = track.stages
          .flatMap((s: any) => [s.startDate, s.endDate])
          .filter(Boolean)
          .map((d: any) => new Date(d).getTime());

        if (dates.length > 0) {
          min = Math.min(min, ...dates);
          max = Math.max(max, ...dates);
        }
      }
    });

    return {
      minDate: new Date(min - 5 * DAY_MS),
      maxDate: new Date(max + 5 * DAY_MS),
    };
  }, [tracks]);

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / DAY_MS);

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

  const hasTracksWithDates = tracks.some(t => t.stages && t.stages.length > 0 && t.stages[0].startDate);

  return (
    <div className="overflow-x-auto pb-8 rounded-xl bg-slate-900/50 border border-slate-800 p-6 shadow-xl custom-scrollbar relative">
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
        <div className="mt-4 space-y-4 relative">
          {orderedTracks.map((track, index) => (
            <div
              key={track.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="group/row"
            >
              <DraggableTrackRow 
                track={track} 
                minDate={minDate} 
                maxDate={maxDate} 
                totalDays={totalDays} 
                months={months} 
                onEditTrack={onEditTrack}
              />
            </div>
          ))}
          
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
