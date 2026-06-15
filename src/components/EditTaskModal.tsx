'use client';

import { useState, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import toast from 'react-hot-toast';

export function EditTaskModal({ task, tracks, onClose }: { task: any, tracks: any[], onClose: () => void }) {
  const [description, setDescription] = useState(task.description);
  const [trackId, setTrackId] = useState(task.trackId || '');
  const [deadline, setDeadline] = useState(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || '');
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { data: users } = useSWR('/api/users', fetcher);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          trackId: trackId || null,
          deadline: deadline || null,
          assigneeId: assigneeId || null
        })
      });
      if (!res.ok) throw new Error('Update failed');
      
      toast.success('Задача обновлена');
      mutate('/api/tasks');
      onClose();
    } catch (err) {
      toast.error('Ошибка сохранения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-orange-400">Редактировать задачу</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Описание задачи</label>
            <input required disabled={isLoading} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-orange-500 disabled:opacity-50" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Ответственный (опционально)</label>
            <select disabled={isLoading} value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-orange-500 disabled:opacity-50">
              <option value="">-- Не назначен --</option>
              {users?.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Привязать к треку (опционально)</label>
            <select disabled={isLoading} value={trackId} onChange={e => setTrackId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-orange-500 disabled:opacity-50">
              <option value="">-- Без трека --</option>
              {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Дедлайн (опционально)</label>
            <input type="date" disabled={isLoading} value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-orange-500 disabled:opacity-50" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" disabled={isLoading} onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50">Отмена</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
