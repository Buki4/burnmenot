'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TrackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Composition');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
    setIsLoading(false);
    router.refresh();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full font-medium transition-colors border border-slate-700 shadow-lg shadow-slate-900/30 whitespace-nowrap w-full md:w-auto"
      >
        + Новый Трек
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-slate-200">Новый Трек</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Название трека</label>
                <input required disabled={isLoading} value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-slate-500 disabled:opacity-50" placeholder="Рабочее название..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Статус готовности</label>
                <select disabled={isLoading} value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-slate-500 disabled:opacity-50">
                  <option value="Composition">Сочинение (Джемы)</option>
                  <option value="Rehearsal">Репетиции (Отработка)</option>
                  <option value="Recording">Запись</option>
                  <option value="Mixing">Сведение / Мастеринг</option>
                  <option value="Done">Готово к релизу</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" disabled={isLoading} onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50">Отмена</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors border border-slate-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
