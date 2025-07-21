import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import KanbanColumn from './kanban/KanbanColumn';
import TaskDialog from './kanban/TaskDialog';
import KanbanDropdown from './kanban/KanbanDropdown';


const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      lightColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      tasks: [
        {
          id: '1',
          title: 'Design Homepage Mockup',
          description: 'Create wireframes and mockups for the new homepage design',
          assignee: {
            name: 'Alice Johnson',
            avatar: '',
            initials: 'AJ'
          },
          priority: 'high',
          dueDate: '2024-01-20',
          comments: 3,
          attachments: 2,
          labels: ['Design', 'UI/UX'],
          documents: [
            { name: 'homepage-wireframe.pdf', url: 'https://example.com/homepage-wireframe.pdf', type: 'pdf' },
            { name: 'design-specs.figma', url: 'https://figma.com/design-specs', type: 'figma' }
          ]
        },
        {
          id: '2',
          title: 'Setup Database Schema',
          description: 'Define and implement the database structure for user management',
          assignee: {
            name: 'Bob Smith',
            avatar: '',
            initials: 'BS'
          },
          priority: 'medium',
          dueDate: '2024-01-25',
          comments: 1,
          attachments: 0,
          labels: ['Backend', 'Database'],
          documents: [
            { name: 'schema-diagram.png', url: 'https://example.com/schema-diagram.png', type: 'image' }
          ]
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-gradient-to-br from-blue-400 to-blue-500',
      lightColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      tasks: [
        {
          id: '3',
          title: 'Implement User Authentication',
          description: 'Add login/signup functionality with JWT tokens',
          assignee: {
            name: 'Carol Davis',
            avatar: '',
            initials: 'CD'
          },
          priority: 'high',
          dueDate: '2024-01-22',
          comments: 5,
          attachments: 1,
          labels: ['Backend', 'Security'],
          documents: [
            { name: 'auth-flow.pdf', url: 'https://example.com/auth-flow.pdf', type: 'pdf' },
            { name: 'security-checklist.docx', url: 'https://example.com/security-checklist.docx', type: 'document' }
          ]
        }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-gradient-to-br from-green-400 to-green-500',
      lightColor: 'bg-gradient-to-br from-green-50 to-green-100',
      tasks: [
        {
          id: '4',
          title: 'Project Setup',
          description: 'Initialize project structure and dependencies',
          assignee: {
            name: 'Eve Brown',
            avatar: '',
            initials: 'EB'
          },
          priority: 'low',
          dueDate: '2024-01-15',
          comments: 0,
          attachments: 0,
          labels: ['Setup'],
          documents: [
            { name: 'project-structure.md', url: 'https://example.com/project-structure.md', type: 'markdown' }
          ]
        }
      ]
    }
  ]);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (task, columnId) => {
    setDraggedTask(task);
    setDraggedFromColumn(columnId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      assignee: {
        name: taskData.email.split('@')[0] || 'Unknown',
        avatar: '',
        initials: (taskData.email.split('@')[0] || 'UN').substring(0, 2).toUpperCase()
      },
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      comments: 0,
      attachments: taskData.attachments.length,
      labels: [],
      documents: taskData.attachments
    };

    const targetColumnId = taskData.status === 'todo' ? 'todo' : 
                          taskData.status === 'in-progress' ? 'in-progress' : 'completed';

    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === targetColumnId 
          ? { ...column, tasks: [newTask, ...column.tasks] }
          : column
      )
    );

    toast({
      title: "Task Created",
      description: `"${taskData.title}" has been added to ${targetColumnId.replace('-', ' ')}.`,
    });
  };

  const handleEditTask = (taskData) => {
    if (!editingTask) return;

    const updatedTask = {
      ...editingTask.task,
      title: taskData.title,
      description: taskData.description,
      assignee: {
        name: taskData.email.split('@')[0] || 'Unknown',
        avatar: '',
        initials: (taskData.email.split('@')[0] || 'UN').substring(0, 2).toUpperCase()
      },
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      attachments: taskData.attachments.length,
      documents: taskData.attachments
    };

    const newColumnId = taskData.status === 'todo' ? 'todo' : 
                       taskData.status === 'in-progress' ? 'in-progress' : 'completed';

    setColumns(prevColumns => {
      const columnsWithoutTask = prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== editingTask.task.id)
      }));

      return columnsWithoutTask.map(column =>
        column.id === newColumnId
          ? { ...column, tasks: [updatedTask, ...column.tasks] }
          : column
      );
    });

    setEditingTask(null);
    toast({
      title: "Task Updated",
      description: `"${taskData.title}" has been updated successfully.`,
    });
  };

  const handleDuplicateTask = (task, columnId) => {
    const duplicatedTask = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Copy)`
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, tasks: [duplicatedTask, ...column.tasks] }
          : column
      )
    );

    toast({
      title: "Task Duplicated",
      description: `"${task.title}" has been duplicated.`,
    });
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask || !draggedFromColumn) return;

    if (draggedFromColumn === targetColumnId) {
      setDraggedTask(null);
      setDraggedFromColumn(null);
      return;
    }

    const updatedTask = {
      ...draggedTask,
      priority: targetColumnId === 'completed' ? 'low'  :
                targetColumnId === 'in-progress' ? 'medium'  : 'high' 
    };

    setColumns(prevColumns => 
      prevColumns.map(column => {
        if (column.id === draggedFromColumn) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== draggedTask.id)
          };
        }
        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [updatedTask, ...column.tasks]
          };
        }
        return column;
      })
    );

    setDraggedTask(null);
    setDraggedFromColumn(null);
  };

  const handleDeleteTask = (taskId, columnId) => {
    const taskToDelete = columns.find(col => col.id === columnId)?.tasks.find(task => task.id === taskId);
    
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
          : column
      )
    );

    toast({
      title: "Task Deleted",
      description: `"${taskToDelete?.title}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleSetReminder = (taskId) => {
    const task = columns.flatMap(col => col.tasks).find(t => t.id === taskId);
    
    toast({
      title: "Reminder Set",
      description: `Reminder set for "${task?.title}". You'll be notified on the due date.`,
    });
  };

  const openEditDialog = (task, columnId) => {
    setEditingTask({ task, columnId });
    setIsTaskDialogOpen(true);
  };

  const openAddTaskDialog = (columnId) => {
    setDefaultStatus(columnId || 'todo');
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  };

  const closeTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setEditingTask(null);
    setDefaultStatus('todo');
  };

  const handleManageLabels = () => {
    toast({
      title: "Manage Labels",
      description: "Labels management feature coming soon!",
    });
  };

  const handleManageMembers = () => {
    toast({
      title: "Manage Members",
      description: "Members management feature coming soon!",
    });
  };

  const handleArchiveCompleted = () => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === 'completed'
          ? { ...column, tasks: [] }
          : column
      )
    );
    toast({
      title: "Completed Tasks Archived",
      description: "All completed tasks have been archived.",
    });
  };

  const handleFilterTasks = () => {
    toast({
      title: "Filter Tasks",
      description: "Task filtering feature coming soon!",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Kanban Board</h1>
            <p className="text-gray-600">Drag and drop tasks to update their status and priority</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => openAddTaskDialog()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            
            <KanbanDropdown
              onAddTask={() => openAddTaskDialog()}
              onManageLabels={handleManageLabels}
              onManageMembers={handleManageMembers}
              onArchiveCompleted={handleArchiveCompleted}
              onFilterTasks={handleFilterTasks}
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-6 p-6 overflow-x-auto">
          {columns.map((column) => (
            <KanbanColumn 
              key={column.id} 
              column={column}
              onEditTask={openEditDialog}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
              onSetReminder={handleSetReminder}
              onAddTask={openAddTaskDialog}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              isDragOver={dragOverColumn === column.id}
            />
          ))}
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={closeTaskDialog}
        onCreateTask={editingTask ? handleEditTask : handleCreateTask}
        initialData={editingTask ? {
          title: editingTask.task.title,
          description: editingTask.task.description,
          email: `${editingTask.task.assignee.name}@example.com`,
          status: editingTask.columnId,
          priority: editingTask.task.priority,
          dueDate: editingTask.task.dueDate,
          attachments: editingTask.task.documents || []
        } : {
          status: defaultStatus
        }}
        mode={editingTask ? 'edit' : 'create'}
      />
    </div>
  );
};

export default KanbanBoard;