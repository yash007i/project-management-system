import React from 'react';
import { MoreVertical, Edit, Trash2, CheckSquare, Share2, Copy, Clock, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const TaskListActions = ({
  onEdit,
  onDelete,
  onComplete,
  onAssign,
  onDuplicate,
  onSetReminder
}) => {
  const handleAction = (action) => (e) => {
    e.stopPropagation();
    action();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-white shadow-lg border">
        <DropdownMenuItem onClick={handleAction(onEdit)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onComplete)} className="cursor-pointer">
          <CheckSquare className="mr-2 h-4 w-4" />
          Mark Complete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onAssign)} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Reassign
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onDuplicate)} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onSetReminder)} className="cursor-pointer">
          <Clock className="mr-2 h-4 w-4" />
          Set Reminder
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleAction(onDelete)} 
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskListActions;