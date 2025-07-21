import React from 'react';
import { MoreHorizontal, Plus, Settings, Users, Archive, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const KanbanDropdown = ({
  onAddTask,
  onManageLabels,
  onManageMembers,
  onArchiveCompleted,
  onFilterTasks
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border">
        <DropdownMenuItem onClick={onAddTask} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add New Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onManageLabels} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Manage Labels
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onManageMembers} className="cursor-pointer">
          <Users className="mr-2 h-4 w-4" />
          Manage Members
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onFilterTasks} className="cursor-pointer">
          <Filter className="mr-2 h-4 w-4" />
          Filter Tasks
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onArchiveCompleted} className="cursor-pointer">
          <Archive className="mr-2 h-4 w-4" />
          Archive Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KanbanDropdown