import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  FileText,
  Clock,
  Flag,
  Target,
  X,
  Plus,
  FolderPlus
} from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  status: z.enum(['not started', 'in progress', 'completed', 'on hold']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
});

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

export const ProjectDialog = ({
  open,
  onOpenChange,
  onSubmit,
  mode,
  initialData,
}) => {
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate || new Date(),
      status: initialData?.status || 'not started',
      priority: initialData?.priority || 'medium',
    },
  });

  const handleSubmit = (data) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            {mode === 'create' ? (
              <>
                <FolderPlus className="h-5 w-5 text-blue-600" />
                Create New Project
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 text-blue-600" />
                Edit Project
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Fill in the details to create a new project.'
              : 'Update the project details below.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4" />
                    Project Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter project name"
                      {...field}
                      className="bg-background/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter project description"
                      {...field}
                      className="bg-background/50 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold">
                      <Target className="h-4 w-4" />
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold">
                      <Flag className="h-4 w-4" />
                      Priority
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon 
                                className={cn(
                                  "h-4 w-4",
                                  option.value === 'low' && "text-green-500",
                                  option.value === 'medium' && "text-yellow-500",
                                  option.value === 'high' && "text-orange-500",
                                  option.value === 'critical' && "text-red-500"
                                )}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-semibold">
                    <CalendarIcon className="h-4 w-4" />
                    Due Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-background/50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {mode === 'create' ? 'Create Project' : 'Update Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};