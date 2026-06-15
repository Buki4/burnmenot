import prisma from '@/lib/prisma';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskModal } from '@/components/TaskModal';
import { TrackModal } from '@/components/TrackModal';

export default async function TracksPage() {
  const tasks = await prisma.task.findMany({
    include: { assignee: true, track: true },
    orderBy: { createdAt: 'desc' }
  });

  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <RealtimeRefresher />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Задачи и Треки</h1>
        <div className="flex gap-4">
          <TrackModal />
          <TaskModal tracks={tracks} />
        </div>
      </div>
      
      {/* Список треков */}
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {tracks.map(track => (
          <div key={track.id} className="min-w-[220px] bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
            <h3 className="text-xl font-bold text-slate-200 truncate pr-2" title={track.name}>{track.name}</h3>
            <span className="inline-block mt-2 px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-md w-max border border-slate-700">
              {track.status}
            </span>
          </div>
        ))}
        {tracks.length === 0 && (
          <p className="text-slate-500 italic py-4">Добавьте свой первый трек, чтобы привязывать к нему задачи.</p>
        )}
      </div>

      <KanbanBoard initialTasks={tasks} tracks={tracks} />
    </div>
  );
}
