'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

export function TrackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Composition');
  const [compStartDate, setCompStartDate] = useState('');
  const [compEndDate, setCompEndDate] = useState('');
  const [rehStartDate, setRehStartDate] = useState('');
  const [rehEndDate, setRehEndDate] = useState('');
  const [recStartDate, setRecStartDate] = useState('');
  const [recEndDate, setRecEndDate] = useState('');
  const [showDates, setShowDates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        status,
        compStartDate: compStartDate || undefined,
        compEndDate: compEndDate || undefined,
        rehStartDate: rehStartDate || undefined,
        rehEndDate: rehEndDate || undefined,
        recStartDate: recStartDate || undefined,
        recEndDate: recEndDate || undefined,
      })
    });
    setIsOpen(false);
    setName('');
    setStatus('Composition');
    setCompStartDate('');
    setCompEndDate('');
    setRehStartDate('');
    setRehEndDate('');
    setRecStartDate('');
    setRecEndDate('');
    setShowDates(false);
    setIsLoading(false);
    toast.success('Трек успешно добавлен');
    mutate('/api/tracks');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl my-auto">
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
                  <option value="Live Prep">Подготовка к лайвам (Плейбеки, Клик)</option>
                </select>
              </div>

              <div>
                <button type="button" onClick={() => setShowDates(!showDates)} className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
                  {showDates ? 'Скрыть сроки этапов' : '+ Установить сроки этапов (Таймлайн)'}
                </button>
              </div>

              {showDates && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-500 w-20">Сочинение</span>
                    <input type="date" value={compStartDate} onChange={e => setCompStartDate(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                    <span className="text-slate-500">-</span>
                    <input type="date" value={compEndDate} onChange={e => setCompEndDate(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-500 w-20">Репетиции</span>
                    <input type="date" value={rehStartDate} onChange={e => setRehStartDate(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                    <span className="text-slate-500">-</span>
                    <input type="date" value={rehEndDate} onChange={e => setRehEndDate(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-500 w-20">Запись</span>
                    <input type="date" value={recStartDate} onChange={e => setRecStartDate(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                    <span className="text-slate-500">-</span>
                    <input type="date" value={recEndDate} onChange={e => setRecEndDate(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                  </div>
                </div>
              )}
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
