'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TaskModal({ tracks }: { tracks: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [trackId, setTrackId] = useState('');
  const [deadline, setDeadline] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        trackId: trackId || null,
        deadline: deadline || null
      })
    });
    setIsOpen(false);
    setDescription('');
    setTrackId('');
    setDeadline('');
    router.refresh();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-orange-500/30"
      >
        + Новая задача
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-orange-400">Новая задача</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Описание задачи</label>
                <input required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-orange-500" placeholder="Что нужно сделать?" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Привязать к треку (опционально)</label>
                <select value={trackId} onChange={e => setTrackId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-orange-500">
                  <option value="">-- Без трека --</option>
                  {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Дедлайн (опционально)</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-orange-500" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Отмена</button>
                <button type="submit" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
