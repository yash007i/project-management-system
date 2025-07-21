import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TaskCard from './TaskCard';
import { ColumnDropdown } from './ColumnDropdown';

const KanbanColumn = ({ 
  column, 
  onEditTask, 
  onDeleteTask, 
  onDuplicateTask, 
  onSetReminder,
  onAddTask,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver
}) => {
  const handleDragOver = (e) => {
    onDragOver(e, column.id);
  };

  const handleDrop = (e) => {
    onDrop(e, column.id);
  };

  return (
    <div className="flex-1 min-w-80 max-w-sm flex flex-col h-full">
      {/* Column Header */}
      <div className={`${column.color} rounded-t-xl p-4 shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-lg">{column.title}</h3>
            <Badge variant="secondary" className="bg-white bg-opacity-30 text-white border-white border-opacity-20">
              {column.tasks.length}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-white hover:bg-opacity-20 text-white"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <ColumnDropdown 
              columnId={column.id}
              columnTitle={column.title}
              onAddTask={onAddTask}
            />
          </div>
        </div>
      </div>

      {/* Column Body */}
      <div 
        className={`${column.lightColor} rounded-b-xl flex-1 p-4 shadow-lg border-2 border-t-0 transition-all duration-300 ${
          column.id === 'todo' ? 'border-yellow-200' : 
          column.id === 'in-progress' ? 'border-blue-200' : 
          'border-green-200'
        } ${
          isDragOver 
            ? `${column.id === 'todo' ? 'bg-yellow-200 bg-opacity-50' : 
                 column.id === 'in-progress' ? 'bg-blue-200 bg-opacity-50' : 
                 'bg-green-200 bg-opacity-50'} ring-2 ring-offset-2 ${
                 column.id === 'todo' ? 'ring-yellow-300' : 
                 column.id === 'in-progress' ? 'ring-blue-300' : 
                 'ring-green-300'} scale-102`
            : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={onDragLeave}
        onDrop={handleDrop}
      >
        <div className="h-full space-y-3">
          {column.tasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              index={index}
              onEdit={() => onEditTask(task, column.id)}
              onDelete={() => onDeleteTask(task.id, column.id)}
              onDuplicate={() => onDuplicateTask(task, column.id)}
              onSetReminder={() => onSetReminder(task.id)}
              onDragStart={() => onDragStart(task, column.id)}
            />
          ))}

          {/* Add New Task Button */}
          <Button 
            variant="ghost" 
            className={`w-full justify-start mt-4 border-2 border-dashed transition-all duration-200 ${
              column.id === 'todo' 
                ? 'border-yellow-300 hover:border-yellow-400 hover:bg-yellow-100 hover:bg-opacity-50 text-yellow-700' 
                : column.id === 'in-progress' 
                ? 'border-blue-300 hover:border-blue-400 hover:bg-blue-100 hover:bg-opacity-50 text-blue-700'
                : 'border-green-300 hover:border-green-400 hover:bg-green-100 hover:bg-opacity-50 text-green-700'
            }`}
            onClick={() => onAddTask(column.id)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;