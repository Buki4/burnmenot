'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

export function EventCard({ event }: { event: any }) {
  const { mutate } = useSWRConfig();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const initialDate = new Date(event.date);
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState(event.type);
  const [date, setDate] = useState(initialDate.toISOString().split('T')[0]);
  const [time, setTime] = useState(initialDate.toTimeString().slice(0, 5));

  const isPast = initialDate < new Date();

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить это событие?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Событие удалено');
        mutate('/api/events');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      toast.error('Ошибка удаления');
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${date}T${time}`).toISOString();
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, date: dateTime })
      });
      if (res.ok) {
        toast.success('Событие обновлено');
        setIsEditOpen(false);
        mutate('/api/events');
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      toast.error('Ошибка сохранения');
    }
  };

  return (
    <>
      <li className={`flex items-center justify-between p-4 rounded-xl border group transition-all ${isPast ? 'border-slate-800 opacity-50 bg-slate-950' : 'border-emerald-500/30 bg-slate-800 hover:bg-slate-750'} ${isDeleting ? 'scale-95 opacity-30' : ''}`}>
        <div>
          <h3 className="text-xl font-semibold text-slate-200">{event.title}</h3>
          <p className="text-slate-400 text-sm mt-1">{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(event.date))}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPast ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {event.type}
          </span>
          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
            <button onClick={() => setIsEditOpen(true)} className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-900 rounded border border-slate-700 hover:border-emerald-500/50" title="Редактировать">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 rounded border border-slate-700 hover:border-red-500/50" title="Удалить">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </li>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Редактировать событие</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Название</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500" />
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
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Отмена</button>
                <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-colors">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
