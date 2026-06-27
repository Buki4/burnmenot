'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { FileCard } from '@/components/FileCard';
import { UploadModal } from '@/components/UploadModal';

export default function StoragePage() {
  const { data: files } = useSWR('/api/files', fetcher);
  const { data: tracks } = useSWR('/api/tracks', fetcher);

  const isLoading = !files || !tracks;

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
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Хранилище</h1>
        <UploadModal tracks={tracks} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file: any) => (
            <FileCard key={file.id} file={file} />
          ))}
          {files.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">Хранилище пусто.</p>}
        </div>
      </div>
    </div>
  );
}
