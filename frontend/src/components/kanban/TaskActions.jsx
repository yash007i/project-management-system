import React from 'react';
import { MoreHorizontal, Edit, Trash2, Copy, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const TaskActions = ({
  onEdit,
  onDelete,
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted/50 h-6 w-6 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border">
        <DropdownMenuItem onClick={handleAction(onEdit)} className="cursor-pointer">
          <Edit className="mr-2 h-3 w-3" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onDuplicate)} className="cursor-pointer">
          <Copy className="mr-2 h-3 w-3" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onSetReminder)} className="cursor-pointer">
          <Clock className="mr-2 h-3 w-3" />
          Set Reminder
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleAction(onDelete)} 
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-3 w-3" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActions;