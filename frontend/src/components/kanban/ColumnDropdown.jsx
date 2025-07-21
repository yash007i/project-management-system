import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  MoreHorizontal,
  Plus,
  Edit,
  Archive,
  Trash2,
  Settings,
  Users,
  Filter
} from 'lucide-react';



export const ColumnDropdown = ({ columnId, columnTitle, onAddTask }) => {
  const { toast } = useToast();

  const handleEditColumn = () => {
    toast({
      title: "Edit Column",
      description: `Edit ${columnTitle} column settings`,
    });
  };

  const handleArchiveColumn = () => {
    toast({
      title: "Archive Column",
      description: `${columnTitle} column archived`,
    });
  };

  const handleDeleteColumn = () => {
    toast({
      title: "Delete Column",
      description: `${columnTitle} column deleted`,
      variant: "destructive",
    });
  };

  const handleColumnSettings = () => {
    toast({
      title: "Column Settings",
      description: `Opening settings for ${columnTitle}`,
    });
  };

  const handleAssignUsers = () => {
    toast({
      title: "Assign Users",
      description: `Assign users to ${columnTitle} column`,
    });
  };

  const handleFilterTasks = () => {
    toast({
      title: "Filter Tasks",
      description: `Filter tasks in ${columnTitle} column`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-white/20 text-white">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onAddTask(columnId)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditColumn}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Column
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFilterTasks}>
          <Filter className="h-4 w-4 mr-2" />
          Filter Tasks
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleAssignUsers}>
          <Users className="h-4 w-4 mr-2" />
          Assign Users
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleColumnSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Column Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleArchiveColumn}>
          <Archive className="h-4 w-4 mr-2" />
          Archive Column
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteColumn} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Column
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};