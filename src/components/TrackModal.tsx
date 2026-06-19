'use client';

import { useState, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

export function TrackModal({ trackToEdit, onClose }: { trackToEdit?: any, onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(!!trackToEdit);
  const [name, setName] = useState(trackToEdit?.name || '');
  const [status, setStatus] = useState(trackToEdit?.status || 'Препродакшн');
  
  const defaultStages = (() => {
    const today = new Date();
    const stages = [
      { name: 'Препродакшн', color: 'blue', order: 0 },
      { name: 'Запись', color: 'red', order: 1 },
      { name: 'Сведение', color: 'purple', order: 2 },
      { name: 'Релиз', color: 'emerald', order: 3 },
    ];
    
    return stages.map((s, i) => {
      const start = new Date(today.getTime() + (i * 21) * 24 * 60 * 60 * 1000);
      const end = new Date(today.getTime() + ((i + 1) * 21) * 24 * 60 * 60 * 1000);
      return {
        ...s,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      };
    });
  })();

  const initialStages = trackToEdit?.stages 
    ? trackToEdit.stages.map((s: any) => ({
        ...s,
        startDate: s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : '',
        endDate: s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : ''
      }))
    : defaultStages;

  const [stages, setStages] = useState<any[]>(initialStages);
  const [showDates, setShowDates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  // Keep modal open if trackToEdit changes
  useEffect(() => {
    if (trackToEdit) {
      setIsOpen(true);
      setName(trackToEdit.name);
      setStatus(trackToEdit.status);
      setStages(trackToEdit.stages.map((s: any) => ({
        ...s,
        startDate: s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : '',
        endDate: s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : ''
      })));
    }
  }, [trackToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const method = trackToEdit ? 'PUT' : 'POST';
    const url = trackToEdit ? `/api/tracks/${trackToEdit.id}` : '/api/tracks';

    // Filter out stages to only send dates if they exist, to save DB space and keep it clean
    // For waterfall dates: startDate of stage > 0 is the endDate of previous stage
    const payload = {
      name,
      status,
      stages: stages.map((s, i) => {
        let computedStartDate = s.startDate;
        if (i > 0) {
          const prevStageWithEndDate = stages.slice(0, i).reverse().find(prev => prev.endDate);
          computedStartDate = prevStageWithEndDate ? prevStageWithEndDate.endDate : stages[0].startDate;
        }

        return {
          name: s.name,
          color: s.color,
          startDate: computedStartDate || null,
          endDate: s.endDate || null,
          order: i
        };
      })
    };

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!trackToEdit) {
      setIsOpen(false);
      setName('');
      setStatus('Препродакшн');
      setStages(defaultStages);
      setShowDates(false);
    } else {
      if (onClose) onClose();
    }
    
    setIsLoading(false);
    toast.success(trackToEdit ? 'Трек обновлен' : 'Трек успешно добавлен');
    mutate('/api/tracks');
  };

  const addStage = () => {
    setStages([...stages, { name: 'Новая стадия', color: 'emerald', startDate: '', endDate: '', order: stages.length }]);
  };

  const removeStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, field: string, value: string) => {
    const newStages = [...stages];
    newStages[index][field] = value;
    setStages(newStages);
  };

  const colors = [
    { label: 'Синий', value: 'blue' },
    { label: 'Красный', value: 'red' },
    { label: 'Оранж.', value: 'orange' },
    { label: 'Фиол.', value: 'purple' },
    { label: 'Розов.', value: 'pink' },
    { label: 'Зелен.', value: 'emerald' },
  ];

  return (
    <>
      {!trackToEdit && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full font-medium transition-colors border border-slate-700 shadow-lg shadow-slate-900/30 whitespace-nowrap w-full md:w-auto"
        >
          + Новый Трек
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl my-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold mb-4 text-slate-200">{trackToEdit ? 'Редактировать Трек' : 'Новый Трек'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Название трека</label>
                <input required disabled={isLoading} value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-slate-500 disabled:opacity-50" placeholder="Рабочее название..." />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Текущий статус</label>
                <select disabled={isLoading} value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-slate-500 disabled:opacity-50">
                  {stages.map((s, i) => (
                    <option key={i} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Готово к релизу">Готово к релизу</option>
                </select>
              </div>

              <div>
                <button type="button" onClick={() => setShowDates(!showDates)} className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
                  {showDates ? 'Скрыть стадии' : '+ Управление стадиями и сроками (Таймлайн)'}
                </button>
              </div>

              {showDates && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  {stages.map((stage, index) => (
                    <div key={index} className="flex flex-col gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg relative group">
                      <div className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={stage.name} 
                          onChange={e => updateStage(index, 'name', e.target.value)} 
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" 
                          placeholder="Название стадии"
                        />
                        <select 
                          value={stage.color} 
                          onChange={e => updateStage(index, 'color', e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200"
                        >
                          {colors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                        <button type="button" onClick={() => removeStage(index)} className="text-red-400 hover:text-red-300 px-1">✕</button>
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        {index === 0 && (
                          <>
                            <span className="text-xs text-slate-500 min-w-[50px]">Старт:</span>
                            <input type="date" value={stage.startDate} onChange={e => updateStage(index, 'startDate', e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                          </>
                        )}
                        <span className="text-xs text-slate-500 min-w-[50px] pl-2">Дедлайн:</span>
                        <input type="date" value={stage.endDate} onChange={e => updateStage(index, 'endDate', e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-md p-1.5 text-xs text-slate-200" />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addStage} className="w-full py-2 border border-dashed border-slate-700 text-slate-400 rounded-lg hover:text-slate-200 hover:border-slate-500 transition-colors text-sm">
                    + Добавить стадию
                  </button>
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" disabled={isLoading} onClick={() => trackToEdit && onClose ? onClose() : setIsOpen(false)} className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50">Отмена</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors border border-slate-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
