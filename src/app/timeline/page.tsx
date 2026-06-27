'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { GanttChart } from '@/components/GanttChart';
import { TrackModal } from '@/components/TrackModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TimelinePage() {
  const { data: tracks, error, isLoading } = useSWR('/api/tracks', fetcher);
  const [editingTrack, setEditingTrack] = useState<any>(null);

  if (error) return <div className="text-red-500">Failed to load tracks</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Таймлайн</h1>
          <p className="text-slate-400 mt-2">Отслеживание цикла работы над треками (Диаграмма Ганта)</p>
        </div>
        <TrackModal />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <GanttChart tracks={tracks} onEditTrack={setEditingTrack} />
          {editingTrack && (
            <TrackModal trackToEdit={editingTrack} onClose={() => setEditingTrack(null)} />
          )}
        </>
      )}
    </div>
  );
}
