import prisma from '@/lib/prisma';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import { FileCard } from '@/components/FileCard';

export const dynamic = 'force-dynamic';
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
            <FileCard key={file.id} file={file} />
          ))}
          {files.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">Хранилище пусто.</p>}
        </div>
      </div>
    </div>
  );
}
