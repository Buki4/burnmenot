'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskModal } from '@/components/TaskModal';
import { TrackModal } from '@/components/TrackModal';
import { TrackCard } from '@/components/TrackCard';

export default function TracksPage() {
  const { data: tasks } = useSWR('/api/tasks', fetcher);
  const { data: tracks } = useSWR('/api/tracks', fetcher);

  const isLoading = !tasks || !tracks;

  if (isLoading) {
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
      <div className="flex justify-between items-center mb-4 md:mb-0">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Задачи</h1>
          <p className="hidden md:block text-slate-400 mt-2">Канбан-доска для управления процессами (Предпродакшн, Запись, Сведение, Релиз)</p>
        </div>
        <div className="flex gap-3">
          <TrackModal />
          <TaskModal tracks={tracks} />
        </div>
      </div>
      
      {/* Список треков */}
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {tracks.map((track: any) => (
          <TrackCard key={track.id} track={track} />
        ))}
        {tracks.length === 0 && (
          <p className="text-slate-500 italic py-4">Добавьте свой первый трек, чтобы привязывать к нему задачи.</p>
        )}
      </div>

      <KanbanBoard initialTasks={tasks} tracks={tracks} />
    </div>
  );
}
