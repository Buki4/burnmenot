'use client';

import React, { useState } from 'react';

type Task = any;

const STATUSES = ['New', 'In Progress', 'Done'];

export function KanbanBoard({ initialTasks, tracks }: { initialTasks: Task[], tracks: any[] }) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    setDraggedTaskId(null);

    // Optimistically update or just let the server action / sync event handle it
    // Let's call the API
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
      {STATUSES.map(status => {
        const columnTasks = initialTasks.filter(t => t.status === status);
        
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
                  className={`bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700 cursor-grab active:cursor-grabbing hover:border-orange-500/50 transition-colors ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
                >
                  <p className="text-slate-200 font-medium mb-2">{task.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="bg-slate-900 px-2 py-1 rounded-md">{task.track?.name || 'Без трека'}</span>
                    <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Без срока'}</span>
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
