import prisma from '@/lib/prisma';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';

export default async function Dashboard() {
  const activeTasks = await prisma.task.findMany({
    where: { status: { in: ['New', 'In Progress'] } },
    include: { assignee: true, track: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const upcomingEvents = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 3
  });

  const recentFiles = await prisma.fileRecord.findMany({
    orderBy: { createdAt: 'desc' },
    include: { track: true },
    take: 5
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <RealtimeRefresher />
      <h1 className="text-4xl font-bold mb-8">Дашборд</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Active Tasks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">Активные задачи</h2>
          {activeTasks.length === 0 ? (
            <p className="text-slate-500">Нет активных задач. Время отдыхать! 🎸</p>
          ) : (
            <ul className="space-y-3">
              {activeTasks.map(task => (
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
              {upcomingEvents.map(event => (
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
              {recentFiles.map(file => (
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

      </div>
    </div>
  );
}
