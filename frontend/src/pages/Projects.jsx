import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Calendar,
  Users,
  FolderOpen,
  Star,
  Clock,
  MoreVertical,
  Settings,
  Edit,
  Trash2,
  Share2,
  Eye,
  Kanban,
  Flag,
  Target,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ShareDialog } from '@/components/projects/ShareDialog';
import { cn } from '@/lib/utils';


const Projects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({ status: [], priority: [] });

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      status: "in progress",
      progress: 75,
      members: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Wilson", email: "bob@example.com" },
        { id: 4, name: "Alice Brown", email: "alice@example.com" },
        { id: 5, name: "Charlie Davis", email: "charlie@example.com" }
      ],
      dueDate: "2024-02-15",
      priority: "high",
      tasks: 24,
      completedTasks: 18,
      createdAt: "2024-01-10",
      manager: "John Doe"
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Native iOS and Android app for customer engagement",
      status: "in progress",
      progress: 45,
      members: [
        { id: 1, name: "Sarah Johnson", email: "sarah@example.com" },
        { id: 2, name: "Mike Chen", email: "mike@example.com" },
        { id: 3, name: "Lisa Wang", email: "lisa@example.com" },
        { id: 4, name: "David Kim", email: "david@example.com" },
        { id: 5, name: "Emma Wilson", email: "emma@example.com" },
        { id: 6, name: "Tom Anderson", email: "tom@example.com" },
        { id: 7, name: "Rachel Green", email: "rachel@example.com" },
        { id: 8, name: "Alex Taylor", email: "alex@example.com" }
      ],
      dueDate: "2024-03-20",
      priority: "high",
      tasks: 36,
      completedTasks: 16,
      createdAt: "2024-01-05",
      manager: "Sarah Johnson"
    },
    {
      id: 3,
      name: "Database Migration",
      description: "Migrate legacy database to cloud infrastructure",
      status: "completed",
      progress: 100,
      members: [
        { id: 1, name: "Mike Wilson", email: "mike@example.com" },
        { id: 2, name: "Anna Davis", email: "anna@example.com" },
        { id: 3, name: "James Lee", email: "james@example.com" }
      ],
      dueDate: "2024-01-30",
      priority: "medium",
      tasks: 12,
      completedTasks: 12,
      createdAt: "2023-12-15",
      manager: "Mike Wilson"
    },
    {
      id: 4,
      name: "Marketing Campaign",
      description: "Q1 digital marketing campaign for product launch",
      status: "not started",
      progress: 20,
      members: [
        { id: 1, name: "Emily Davis", email: "emily@example.com" },
        { id: 2, name: "Chris Brown", email: "chris@example.com" },
        { id: 3, name: "Sophie Miller", email: "sophie@example.com" },
        { id: 4, name: "Ryan Clark", email: "ryan@example.com" },
        { id: 5, name: "Kelly Johnson", email: "kelly@example.com" },
        { id: 6, name: "Mark Thompson", email: "mark@example.com" }
      ],
      dueDate: "2024-04-01",
      priority: "medium",
      tasks: 18,
      completedTasks: 4,
      createdAt: "2024-01-20",
      manager: "Emily Davis"
    }
  ]);

  const filterOptions = [
    { label: "All Projects", value: "all", icon: LayoutGrid },
    { label: "Not Started", value: "not started", icon: Clock },
    { label: "In Progress", value: "in progress", icon: Target },
    { label: "Completed", value: "completed", icon: Star },
    { label: "On Hold", value: "on hold", icon: Flag },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesStatusFilter = filters.status.length === 0 || filters.status.includes(project.status);
    const matchesPriorityFilter = filters.priority.length === 0 || filters.priority.includes(project.priority);
    
    return matchesSearch && matchesStatus && matchesStatusFilter && matchesPriorityFilter;
  });

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    setDialogMode('create');
    setSelectedProject(null);
    setShowProjectDialog(true);
  };

  const handleEditProject = (project) => {
    setDialogMode('edit');
    setSelectedProject(project);
    setShowProjectDialog(true);
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  const handleShareProject = (project) => {
    setSelectedProject(project);
    setShowShareDialog(true);
  };

  const handleProjectSettings = (project) => {
    toast({
      title: "Project Settings",
      description: `Opening settings for "${project.name}"`,
    });
  };

  const handleProjectSubmit = (data) => {
    if (dialogMode === 'create') {
      const newProject = {
        id: Math.max(...projects.map(p => p.id)) + 1,
        name: data.name,
        description: data.description,
        status: data.status,
        progress: 0,
        members: [],
        dueDate: data.dueDate.toISOString().split('T')[0],
        priority: data.priority,
        tasks: 0,
        completedTasks: 0,
        createdAt: new Date().toISOString().split('T')[0],
        manager: "Current User"
      };
      setProjects([...projects, newProject]);
      toast({
        title: "Project created!",
        description: `${data.name} has been created successfully.`,
      });
    } else if (selectedProject) {
      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? { ...p, ...data, dueDate: data.dueDate.toISOString().split('T')[0] }
          : p
      ));
      toast({
        title: "Project updated!",
        description: `${data.name} has been updated successfully.`,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedProject) {
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      toast({
        title: "Project deleted!",
        description: `${selectedProject.name} has been deleted.`,
        variant: "destructive",
      });
      setShowDeleteDialog(false);
      setSelectedProject(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'not started': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'on hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-6 min-h-screen">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              <div className="space-y-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      statusFilter === option.value 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <option.icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Access</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <FolderOpen className="h-4 w-4" />
                  <span>File Organization</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Users className="h-4 w-4" />
                  <span>Team Members</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground mt-1">Manage your projects and collaborate with your team</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              onClick={handleCreateProject}
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : ''}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(true)}
                className={cn(
                  "hover:bg-blue-50 hover:border-blue-300",
                  hasActiveFilters && 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                )}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 rounded-full flex items-center justify-center text-xs bg-white text-blue-600">
                    {filters.status.length + filters.priority.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Projects Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:card-glow"
                    onClick={() => handleProjectClick(project.id)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mt-1">
                        {project.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleProjectClick(project.id); }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}>
                          <Kanban className="h-4 w-4 mr-2" />
                          Open Kanban
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShareProject(project); }}>
                          <Share2 className="h-4 w-4 mr-2 text-green-600" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleProjectSettings(project); }}>
                          <Settings className="h-4 w-4 mr-2 text-gray-600" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDeleteProject(project); }} 
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{project.members.length}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{project.completedTasks}/{project.tasks}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="block">Manager:</span>
                        <span className="font-medium text-foreground">{project.manager}</span>
                      </div>
                      <div>
                        <span className="block">Created:</span>
                        <span className="font-medium text-foreground">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <ProjectDialog
        open={showProjectDialog}
        onOpenChange={setShowProjectDialog}
        onSubmit={handleProjectSubmit}
        mode={dialogMode}
        initialData={selectedProject ? {
          name: selectedProject.name,
          description: selectedProject.description,
          dueDate: new Date(selectedProject.dueDate),
          status: selectedProject.status,
          priority: selectedProject.priority,
        } : undefined}
      />

      <ProjectFilters
        open={showFilters}
        onOpenChange={setShowFilters}
        onFiltersChange={setFilters}
        currentFilters={filters}
      />

      {selectedProject && (
        <ShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          projectName={selectedProject.name}
          projectId={selectedProject.id}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{selectedProject?.name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;