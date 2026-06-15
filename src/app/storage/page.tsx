import prisma from '@/lib/prisma';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import { UploadModal } from '@/components/UploadModal';

export default async function StoragePage() {
  const files = await prisma.fileRecord.findMany({
    orderBy: { createdAt: 'desc' },
    include: { track: true }
  });

  const tracks = await prisma.track.findMany();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <RealtimeRefresher />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Хранилище</h1>
        <UploadModal tracks={tracks} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <div key={file.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-purple-500/50 transition-all group shadow-md hover:shadow-purple-500/10">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-200 truncate pr-2" title={file.name}>{file.name}</h3>
                <span className="bg-slate-900 text-xs px-2 py-1 rounded text-purple-400 whitespace-nowrap border border-slate-700">{file.type}</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">{file.track?.name || 'Глобальный файл'}</p>
              
              {file.type === 'VoiceNote' || file.type === 'Demo' ? (
                <audio src={file.path} controls className="w-full h-10 filter invert opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <a href={file.path} download className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600">
                  Скачать
                </a>
              )}
            </div>
          ))}
          {files.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">Хранилище пусто.</p>}
        </div>
      </div>
    </div>
  );
}
