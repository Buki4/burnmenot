'use client';

import React, { useState } from 'react';

type Task = any;

const STATUSES = ['New', 'In Progress', 'Done'];

import toast from 'react-hot-toast';

export function KanbanBoard({ initialTasks, tracks }: { initialTasks: Task[], tracks: any[] }) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Sync tasks when initialTasks change (e.g. from server refresh)
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId));

    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      toast.success('Задача удалена');
    } catch (err) {
      setTasks(previousTasks);
      toast.error('Ошибка при удалении');
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    setDraggedTaskId(null);

    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      // Revert on error
      setTasks(previousTasks);
    }
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
      {STATUSES.map(status => {
        const columnTasks = tasks.filter(t => t.status === status);
        
        return (
          <div 
            key={status} 
            className="flex-1 min-w-[300px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col"
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={allowDrop}
          >
            <h3 className="text-xl font-semibold mb-4 text-slate-300 border-b border-slate-800 pb-2">
              {status} <span className="text-sm font-normal text-slate-500 ml-2">{columnTasks.length}</span>
            </h3>
            <div className="flex-1 flex flex-col gap-3">
              {columnTasks.map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700 cursor-grab active:cursor-grabbing hover:border-orange-500/50 transition-colors group ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
                >
                  <p className="text-slate-200 font-medium mb-2">{task.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                    <span className="bg-slate-900 px-2 py-1 rounded-md">{task.track?.name || 'Без трека'}</span>
                    <div className="flex items-center gap-2">
                      <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Без срока'}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Удалить задачу"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-center text-slate-600 p-4 border-2 border-dashed border-slate-700 rounded-xl">
                  Перетащите сюда
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
