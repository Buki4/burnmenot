'use client';

import { useState, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

interface EventModalProps {
  isOpenProp?: boolean;
  onClose?: () => void;
  defaultDate?: string;
  eventToEdit?: any;
  hideTrigger?: boolean;
}

export function EventModal({ isOpenProp, onClose, defaultDate, eventToEdit, hideTrigger }: EventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Rehearsal');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { mutate } = useSWRConfig();

  const activeIsOpen = isOpenProp !== undefined ? isOpenProp : isOpen;

  useEffect(() => {
    if (activeIsOpen) {
      if (eventToEdit) {
        setTitle(eventToEdit.title);
        setType(eventToEdit.type);
        const d = new Date(eventToEdit.date);
        setDate(d.toISOString().split('T')[0]);
        setTime(d.toTimeString().slice(0, 5));
      } else {
        setTitle('');
        setType('Rehearsal');
        setDate(defaultDate || '');
        setTime('19:00');
      }
    }
  }, [activeIsOpen, defaultDate, eventToEdit]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${date}T${time}`).toISOString();
    
    const url = eventToEdit ? `/api/events/${eventToEdit.id}` : '/api/events';
    const method = eventToEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          date: dateTime
        })
      });
      if (!res.ok) throw new Error('Failed to save event');
      
      toast.success(eventToEdit ? 'Событие обновлено' : 'Событие добавлено');
      handleClose();
      mutate('/api/events');
    } catch (err) {
      toast.error('Ошибка сохранения события');
    }
  };

  const handleDelete = async () => {
    if (!eventToEdit) return;
    if (!confirm('Удалить событие?')) return;
    try {
      await fetch(`/api/events/${eventToEdit.id}`, { method: 'DELETE' });
      toast.success('Событие удалено');
      handleClose();
      mutate('/api/events');
    } catch (err) {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <>
      {!hideTrigger && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/30"
        >
          + Добавить событие
        </button>
      )}

      {activeIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">
              {eventToEdit ? 'Редактировать' : 'Новое событие'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Название</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500" placeholder="Название..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Тип события</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-emerald-500">
                  <option value="Rehearsal">Репетиция</option>
                  <option value="Gig">Концерт</option>
                  <option value="Recording">Запись на студии</option>
                  <option value="Shooting">Съемки</option>
                  <option value="Hangout">Тусовка</option>
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
              <div className="flex justify-between items-center mt-6">
                {eventToEdit ? (
                  <button type="button" onClick={handleDelete} className="text-red-400 hover:text-red-300 text-sm">Удалить</button>
                ) : <div/>}
                <div className="flex gap-3">
                  <button type="button" onClick={handleClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors">Отмена</button>
                  <button type="submit" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-colors">Сохранить</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
