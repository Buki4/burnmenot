'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskModal } from '@/components/TaskModal';
import { TrackModal } from '@/components/TrackModal';
import { TrackCard } from '@/components/TrackCard';

export default function TracksPage() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'tracks'>('kanban');
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
            {activeTab === 'kanban' ? 'Задачи' : 'Треки'}
          </h1>
          <p className="hidden md:block text-slate-400 mt-2">Управление задачами и карточками треков</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'tracks' ? <TrackModal /> : <TaskModal tracks={tracks} />}
        </div>
      </div>

      <div className="flex bg-slate-800/50 p-1 rounded-xl w-full md:w-fit border border-slate-800 shrink-0">
        <button 
          onClick={() => setActiveTab('kanban')}
          className={`flex-1 md:px-8 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'kanban' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Канбан (Задачи)
        </button>
        <button 
          onClick={() => setActiveTab('tracks')}
          className={`flex-1 md:px-8 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'tracks' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Карточки треков
        </button>
      </div>
      
      {activeTab === 'tracks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {tracks.map((track: any) => (
            <TrackCard key={track.id} track={track} />
          ))}
          {tracks.length === 0 && (
            <p className="text-slate-500 italic py-4 col-span-full">Добавьте свой первый трек, чтобы привязывать к нему задачи.</p>
          )}
        </div>
      )}

      {activeTab === 'kanban' && (
        <KanbanBoard initialTasks={tasks} tracks={tracks} />
      )}
    </div>
  );
}
