import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Filter,
  X,
  Target,
  Flag,
  Clock,
  FileText,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: 'not started', label: 'Not Started', icon: Clock },
  { value: 'in progress', label: 'In Progress', icon: Target },
  { value: 'completed', label: 'Completed', icon: FileText },
  { value: 'on hold', label: 'On Hold', icon: Flag },
];

const priorityOptions = [
  { value: 'low', label: 'Low', icon: Flag },
  { value: 'medium', label: 'Medium', icon: Flag },
  { value: 'high', label: 'High', icon: Flag },
  { value: 'critical', label: 'Critical', icon: Flag },
];

export const ProjectFilters = ({
  open,
  onOpenChange,
  onFiltersChange,
  currentFilters,
}) => {
  const [filters, setFilters] = useState(currentFilters);

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({ status: [], priority: [] });
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    onOpenChange(false);
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/20 dark:to-purple-950/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Filter className="h-5 w-5 text-primary" />
            Filter Projects
          </DialogTitle>
          <DialogDescription>
            Select filters to refine your project view
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Filters */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Target className="h-4 w-4" />
              Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.status.includes(option.value) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-105",
                    filters.status.includes(option.value) && "gradient-primary text-white"
                  )}
                  onClick={() => toggleFilter('status', option.value)}
                >
                  <option.icon className="h-3 w-3 mr-1" />
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Priority Filters */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Flag className="h-4 w-4" />
              Priority
            </h3>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.priority.includes(option.value) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-105",
                    filters.priority.includes(option.value) && "gradient-primary text-white"
                  )}
                  onClick={() => toggleFilter('priority', option.value)}
                >
                  <option.icon 
                    className={cn(
                      "h-3 w-3 mr-1",
                      !filters.priority.includes(option.value) && option.value === 'low' && "text-green-500",
                      !filters.priority.includes(option.value) && option.value === 'medium' && "text-yellow-500",
                      !filters.priority.includes(option.value) && option.value === 'high' && "text-orange-500",
                      !filters.priority.includes(option.value) && option.value === 'critical' && "text-red-500"
                    )}
                  />
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                {filters.status.length + filters.priority.length} filter(s) applied
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={applyFilters}
            className="gradient-primary text-white flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};