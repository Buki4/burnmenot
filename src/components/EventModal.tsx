'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';

export function EventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Rehearsal');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${date}T${time}`).toISOString();
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        type,
        date: dateTime
      })
    });
    setIsOpen(false);
    setTitle('');
    setDate('');
    setTime('');
    mutate('/api/events');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/30"
      >
        + Добавить событие
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Новое событие</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Название</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500" placeholder="Репетиция / Концерт" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Тип события</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500">
                  <option value="Rehearsal">Репетиция</option>
                  <option value="Gig">Концерт</option>
                  <option value="Recording">Запись на студии</option>
                  <option value="Meeting">Собрание группы</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-slate-400 mb-1">Дата</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-slate-400 mb-1">Время</label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Отмена</button>
                <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-colors">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
