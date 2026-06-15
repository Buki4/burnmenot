import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col p-6 shadow-2xl">
      <h1 className="text-3xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 tracking-wider">BurnMeNot</h1>
      <nav className="flex flex-col space-y-4">
        <Link href="/" className="px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200">Дашборд</Link>
        <Link href="/tracks" className="px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200">Треки и Задачи</Link>
        <Link href="/calendar" className="px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200">Календарь</Link>
        <Link href="/storage" className="px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200">Хранилище</Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-800">
        {/* Floating Voice Recorder placeholder or user info */}
        <div className="text-sm text-slate-500">
          Logged in as: <span className="text-slate-300 font-medium">Performer</span>
        </div>
      </div>
    </aside>
  );
}
