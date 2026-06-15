'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:min-h-screen flex flex-col p-4 md:p-6 shadow-2xl">
      <div className="mb-4 md:mb-10 shrink-0">
        <Image src="/logo.png" alt="BurnMeNot" width={200} height={80} className="w-auto h-12 md:h-16 object-contain" priority />
      </div>
      <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-4 overflow-x-auto pb-2 md:pb-0">
        <Link href="/" className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${pathname === '/' ? 'bg-orange-500/10 text-orange-400 font-medium' : 'hover:bg-slate-800 hover:text-white text-slate-300'}`}>Дашборд</Link>
        <Link href="/tracks" className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${pathname === '/tracks' ? 'bg-orange-500/10 text-orange-400 font-medium' : 'hover:bg-slate-800 hover:text-white text-slate-300'}`}>Треки и Задачи</Link>
        <Link href="/calendar" className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${pathname === '/calendar' ? 'bg-orange-500/10 text-orange-400 font-medium' : 'hover:bg-slate-800 hover:text-white text-slate-300'}`}>Календарь</Link>
        <Link href="/storage" className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg transition-all duration-200 ${pathname === '/storage' ? 'bg-orange-500/10 text-orange-400 font-medium' : 'hover:bg-slate-800 hover:text-white text-slate-300'}`}>Хранилище</Link>
      </nav>
      <div className="hidden md:block mt-auto pt-6 border-t border-slate-800">
        {/* Floating Voice Recorder placeholder or user info */}
        <div className="text-sm text-slate-500">
          Logged in as: <span className="text-slate-300 font-medium">Performer</span>
        </div>
      </div>
    </aside>
  );
}
