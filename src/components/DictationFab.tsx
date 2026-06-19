'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';

export function DictationFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    // Check support on mount
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ru-RU'; // Default to Russian, can be configurable

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            toast.error('Доступ к микрофону запрещен');
          }
        };

        recognition.onend = () => {
          // If we didn't explicitly stop it, it might have stopped due to silence.
          // For now, we'll just reflect the state.
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!isSupported) {
      toast.error('Распознавание речи не поддерживается в этом браузере. Используйте Chrome или Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async () => {
    if (!transcript.trim()) {
      toast.error('Заметка пуста');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const savePromise = fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: transcript })
    }).then(async res => {
      if (!res.ok) throw new Error('Failed to save');
      setTranscript('');
      setIsOpen(false);
      mutate('/api/notes');
    });

    toast.promise(savePromise, {
      loading: 'Сохраняем заметку...',
      success: 'Заметка сохранена!',
      error: 'Ошибка при сохранении'
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-6 w-14 h-14 bg-indigo-500 hover:bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white transition-transform hover:scale-110 z-50"
        title="Новая голосовая заметка"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 w-80 max-w-[calc(100vw-3rem)] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Новая заметка
        </h3>
        <button onClick={() => { setIsOpen(false); if(isRecording) toggleRecording(); }} className="text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Нажмите на микрофон и говорите..."
          className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none custom-scrollbar"
        />
        
        {!isSupported && (
          <p className="text-xs text-red-400 mt-2">Ваш браузер не поддерживает распознавание речи.</p>
        )}
      </div>

      <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex justify-between items-center gap-2">
        <button
          onClick={toggleRecording}
          disabled={!isSupported}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            isRecording 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 animate-pulse' 
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
          }`}
        >
          {isRecording ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Остановить
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Диктовать
            </>
          )}
        </button>
        <button
          onClick={handleSave}
          disabled={!transcript.trim()}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
