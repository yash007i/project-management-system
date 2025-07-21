import React from 'react';
import { MoreVertical, Edit, Trash2, Share2, Copy, Pin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


const NoteActions = ({
  onEdit,
  onDelete,
  onShare,
  onDuplicate,
  onPin
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
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border">
        <DropdownMenuItem onClick={handleAction(onEdit)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Edit Note
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onPin)} className="cursor-pointer">
          <Pin className="mr-2 h-4 w-4" />
          Pin Note
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onDuplicate)} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAction(onShare)} className="cursor-pointer">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleAction(onDelete)} 
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Note
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NoteActions;