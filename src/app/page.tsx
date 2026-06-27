'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function Dashboard() {
  const { data: tasks } = useSWR('/api/tasks', fetcher);
  const { data: events } = useSWR('/api/events', fetcher);
  const { data: files } = useSWR('/api/files', fetcher);
  const { data: tracks } = useSWR('/api/tracks', fetcher);

  const isLoading = !tasks || !events || !files || !tracks;

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

  const activeTasks = tasks.filter((t: any) => t.status === 'New' || t.status === 'In Progress').slice(0, 5);
  const upcomingEvents = events.filter((e: any) => new Date(e.date) >= new Date()).slice(0, 3);
  const recentFiles = files.slice(0, 5);
  const recentTracks = tracks.slice(0, 5);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Дашборд</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Active Tasks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">Активные задачи</h2>
          {activeTasks.length === 0 ? (
            <p className="text-slate-500">Нет активных задач. Время отдыхать! 🎸</p>
          ) : (
            <ul className="space-y-3">
              {activeTasks.map((task: any) => (
                <li key={task.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center transition-all hover:bg-slate-750">
                  <div>
                    <p className="font-medium text-slate-200">{task.description}</p>
                    <p className="text-xs text-slate-400">{task.track?.name || 'Общая задача'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming Events Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Ближайшие события</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-slate-500">Событий не запланировано.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingEvents.map((event: any) => (
                <li key={event.id} className="bg-slate-800 p-3 rounded-lg border-l-4 border-emerald-500">
                  <p className="font-medium text-slate-200">{event.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(event.date)} • {event.type}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Demos Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">Новые файлы</h2>
          {recentFiles.length === 0 ? (
            <p className="text-slate-500">Файлов пока нет.</p>
          ) : (
            <ul className="space-y-3">
              {recentFiles.map((file: any) => (
                <li key={file.id} className="bg-slate-800 p-3 rounded-lg flex items-center justify-between">
                  <div className="truncate">
                    <p className="font-medium text-slate-200 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{file.type} {file.track && `• ${file.track.name}`}</p>
                  </div>
                  {file.type === 'VoiceNote' && (
                    <audio src={file.path} controls className="h-8 w-24 scale-75 origin-right ml-2" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Tracks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-rose-400">Новые треки</h2>
          {recentTracks.length === 0 ? (
            <p className="text-slate-500">Треков пока нет.</p>
          ) : (
            <ul className="space-y-3">
              {recentTracks.map((track: any) => (
                <li key={track.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center transition-all hover:bg-slate-750">
                  <p className="font-medium text-slate-200 truncate pr-2" title={track.name}>{track.name}</p>
                  <span className="px-2 py-1 text-xs rounded-full font-medium bg-slate-700 text-slate-300 border border-slate-600 whitespace-nowrap">
                    {track.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
