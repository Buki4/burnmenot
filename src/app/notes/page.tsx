'use client';

import useSWR, { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function NotesPage() {
  const { data: notes, error, isLoading } = useSWR('/api/notes', fetcher);
  const { mutate } = useSWRConfig();

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

  if (error) return <div className="p-8 text-red-500">Failed to load notes</div>;

  return (
    <div className="p-8 pb-24 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Заметки</h1>
        <p className="text-slate-400 mt-2">Ваши надиктованные идеи и мысли с репетиций</p>
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
                <button 
                  onClick={() => handleDelete(note.id)}
                  className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Удалить"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap flex-1">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
