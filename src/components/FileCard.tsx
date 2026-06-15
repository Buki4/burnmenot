'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

export function FileCard({ file }: { file: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    if (!window.confirm(`Вы уверены, что хотите удалить файл "${file.name}"?`)) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/upload/${file.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Файл удален');
        mutate('/api/files');
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при удалении');
      setIsDeleting(false);
    }
  };

  return (
    <div className={`bg-slate-800 border border-slate-700 p-5 rounded-xl transition-all group shadow-md hover:border-red-500/30 ${isDeleting ? 'opacity-50 scale-95' : 'hover:shadow-purple-500/10'}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-200 truncate pr-2" title={file.name}>{file.name}</h3>
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-xs px-2 py-1 rounded text-purple-400 whitespace-nowrap border border-slate-700">{file.type}</span>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 p-1 rounded-md border border-slate-700 hover:border-red-500/50"
            title="Удалить файл"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
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
  );
}
