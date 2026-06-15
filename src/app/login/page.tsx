'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Неверный пароль');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Ошибка соединения');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <Image src="/logo.png" alt="BurnMeNot" width={240} height={100} className="w-auto h-20 mb-4 object-contain" priority />
          <p className="text-slate-400">Введите пароль группы</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl outline-none focus:border-orange-500 transition-colors placeholder:text-slate-500"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
