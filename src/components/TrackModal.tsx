'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TrackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Composition');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        status
      })
    });
    setIsOpen(false);
    setName('');
    setStatus('Composition');
    router.refresh();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full font-medium transition-colors border border-slate-700 shadow-lg shadow-slate-900/30"
      >
        + Новый Трек
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-slate-200">Новый Трек</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Название трека</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-slate-500" placeholder="Рабочее название..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Статус готовности</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-slate-500">
                  <option value="Composition">Сочинение (Джемы)</option>
                  <option value="Rehearsal">Репетиции (Отработка)</option>
                  <option value="Recording">Запись</option>
                  <option value="Mixing">Сведение / Мастеринг</option>
                  <option value="Done">Готово к релизу</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Отмена</button>
                <button type="submit" className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors border border-slate-600">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
