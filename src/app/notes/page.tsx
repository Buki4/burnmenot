'use client';

import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function NotesPage() {
  const { data: notes, error, isLoading } = useSWR('/api/notes', fetcher);
  const { mutate } = useSWRConfig();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить заметку?')) return;
    
    // Optimistic update
    const previousNotes = notes;
    mutate('/api/notes', notes.filter((n: any) => n.id !== id), false);
    
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Заметка удалена');
      mutate('/api/notes');
    } catch (err) {
      toast.error('Ошибка при удалении');
      mutate('/api/notes', previousNotes);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return;
    
    const previousNotes = notes;
    mutate('/api/notes', notes.map((n: any) => n.id === id ? { ...n, content: editContent } : n), false);
    setEditingId(null);
    
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Заметка обновлена');
      mutate('/api/notes');
    } catch (err) {
      toast.error('Ошибка при обновлении');
      mutate('/api/notes', previousNotes);
    }
  };

  if (error) return <div className="p-8 text-red-500">Failed to load notes</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Заметки</h1>
        <p className="hidden md:block text-slate-400 mt-2">Ваши надиктованные идеи и мысли с репетиций</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes?.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-lg">У вас пока нет заметок.</p>
              <p className="text-sm mt-1">Нажмите на плавающую кнопку микрофона, чтобы надиктовать первую мысль!</p>
            </div>
          )}

          {notes?.map((note: any) => (
            <div key={note.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-indigo-500/50 transition-colors flex flex-col group">
              <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
                <div>
                  <span>{new Date(note.createdAt).toLocaleDateString('ru-RU')}</span>
                  <span className="ml-2">{new Date(note.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingId(note.id);
                      setEditContent(note.content);
                    }}
                    className="text-slate-500 hover:text-indigo-400 opacity-70 hover:opacity-100 transition-all p-1"
                    title="Редактировать"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="text-slate-500 hover:text-red-400 opacity-70 hover:opacity-100 transition-all p-1"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {editingId === note.id ? (
                <div className="flex flex-col gap-2 flex-1">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 min-h-[120px] focus:outline-none focus:border-indigo-500 resize-y"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Отмена
                    </button>
                    <button 
                      onClick={() => handleUpdate(note.id)}
                      className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-sm whitespace-pre-wrap flex-1">{note.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
