'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function TrackCard({ track }: { track: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(`Вы уверены, что хотите удалить трек "${track.name}" и все его задачи?`)) return;
    
    setIsDeleting(true);
    try {
      await fetch(`/api/tracks/${track.id}`, {
        method: 'DELETE'
      });
      toast.success('Трек удален');
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при удалении');
      setIsDeleting(false);
    }
  };

  return (
    <div className={`min-w-[220px] bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-col justify-between group transition-all duration-300 ${isDeleting ? 'opacity-50 scale-95' : ''}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-slate-200 truncate pr-2 max-w-[160px]" title={track.name}>{track.name}</h3>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Удалить трек"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <span className="inline-block mt-2 px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-md w-max border border-slate-700">
        {track.status}
      </span>
    </div>
  );
}
