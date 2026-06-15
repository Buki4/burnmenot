'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

export function UploadModal({ tracks }: { tracks: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('Demo');
  const [trackId, setTrackId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (trackId) formData.append('trackId', trackId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      
      toast.success('Файл загружен');
      setIsOpen(false);
      setFile(null);
      setType('Demo');
      setTrackId('');
      mutate('/api/files');
    } catch (err) {
      toast.error('Ошибка загрузки');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-purple-500/30"
      >
        Загрузить файл
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Загрузить файл</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Выберите файл</label>
                <input required type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Тип файла</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-purple-500">
                  <option value="Demo">Демо-запись (Аудио)</option>
                  <option value="Project">Файл проекта (DAW)</option>
                  <option value="Lyrics">Текст песни / Аккорды</option>
                  <option value="Other">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Привязать к треку (опционально)</label>
                <select value={trackId} onChange={e => setTrackId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-purple-500">
                  <option value="">-- Общий файл --</option>
                  {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" disabled={isUploading} onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50">Отмена</button>
                <button type="submit" disabled={isUploading} className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50">
                  {isUploading ? 'Загрузка...' : 'Загрузить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
