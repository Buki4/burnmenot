'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { TransitionLink } from './TransitionLink';

export function Sidebar() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  const links = [
    {
      href: '/',
      label: 'Дашборд',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: '/tracks',
      label: 'Задачи',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      href: '/timeline',
      label: 'Гант',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      )
    },
    {
      href: '/calendar',
      label: 'Календарь',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      href: '/storage',
      label: 'Хранилище',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      href: '/notes',
      label: 'Заметки',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 min-h-screen flex-col p-6 shadow-2xl relative z-20">
        <div className="mb-10 shrink-0 -ml-2">
          <Image src="/logo.png" alt="BurnMeNot" width={400} height={160} className="w-auto h-28 object-contain scale-125 origin-left" priority />
        </div>
        <nav className="flex flex-col space-y-4">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <TransitionLink 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-500/10 text-orange-400 font-medium' : 'hover:bg-slate-800 hover:text-white text-slate-300'}`}
              >
                {link.icon}
                {link.label}
              </TransitionLink>
            )
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="text-sm text-slate-500">
            Logged in as: <span className="text-slate-300 font-medium">Performer</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-around z-50 pb-safe">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <TransitionLink 
              key={link.href}
              href={link.href} 
              className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${isActive ? 'text-orange-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                {link.icon}
              </div>
              <span className="text-[10px] font-medium">{link.label}</span>
            </TransitionLink>
          )
        })}
      </nav>

      {/* Mobile Top Header - removed per user request */}
    </>
  );
}
