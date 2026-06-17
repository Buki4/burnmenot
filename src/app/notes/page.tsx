'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function NotesPage() {
  const { data: notes, error, isLoading } = useSWR('/api/notes', fetcher);

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
            <div key={note.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-indigo-500/50 transition-colors flex flex-col">
              <div className="text-xs text-slate-500 mb-3 flex items-center justify-between">
                <span>{new Date(note.createdAt).toLocaleDateString('ru-RU')}</span>
                <span>{new Date(note.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap flex-1">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
