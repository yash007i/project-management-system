import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  User,
  Mail,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  FileText,
  CheckSquare,
  Kanban,
  List,
  UserPlus,
  StickyNote,
  Paperclip,
  Award,
  Target,
  TrendingUp,
  Shield,
  Crown,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import KanbanBoard from '@/components/KanbanBoard';
import AddMemberDialog from '@/components/projects/AddMemberDialog';
import RoleUpdateDialog from '@/components/projects/RoleUpdateDialog';
import NoteActions from '@/components/projects/NoteActions';
import TaskListActions from '@/components/projects/TaskListActions';
import ProjectSettingsDialog from '@/components/projects/ProjectSettingsDialog';
import ProjectShareDialog from '@/components/projects/ProjectShareDialog';

const ProjectDetail = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRoleUpdateOpen, setIsRoleUpdateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const project = {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design",
    status: "active",
    progress: 75,
    members: [
      { 
        id: 1, 
        name: "John Doe", 
        email: "john@example.com", 
        role: "owner", 
        avatar: "/api/placeholder/40/40", 
        tasksAssigned: 5, 
        tasksCompleted: 3,
        performance: 85,
        joinedDate: "2024-01-01",
        skills: ["Leadership", "Planning", "Communication"]
      },
      { 
        id: 2, 
        name: "Jane Smith", 
        email: "jane@example.com", 
        role: "admin", 
        avatar: "/api/placeholder/40/40", 
        tasksAssigned: 8, 
        tasksCompleted: 6,
        performance: 92,
        joinedDate: "2024-01-05",
        skills: ["Figma", "Photoshop", "User Research"]
      },
      { 
        id: 3, 
        name: "Mike Wilson", 
        email: "mike@example.com", 
        role: "member", 
        avatar: "/api/placeholder/40/40", 
        tasksAssigned: 12, 
        tasksCompleted: 9,
        performance: 88,
        joinedDate: "2024-01-03",
        skills: ["React", "Node.js", "TypeScript", "MongoDB"]
      },
      { 
        id: 4, 
        name: "Sarah Davis", 
        email: "sarah@example.com", 
        role: "member", 
        avatar: "/api/placeholder/40/40", 
        tasksAssigned: 6, 
        tasksCompleted: 4,
        performance: 90,
        joinedDate: "2024-01-08",
        skills: ["Testing", "Automation", "Quality Assurance"]
      }
    ],
    dueDate: "2024-02-15",
    priority: "high",
    manager: "John Doe",
    createdAt: "2024-01-10",
    totalTasks: 24,
    completedTasks: 18
  };

  const allTasks = [
    { 
      id: 1, 
      title: 'Design Homepage Layout', 
      description: 'Create wireframes and mockups for the new homepage', 
      assignee: 'Jane Smith', 
      priority: 'high', 
      dueDate: '2024-01-20',
      status: 'To Do',
      documents: [
        { name: 'homepage-wireframe.pdf', url: '#', type: 'pdf' },
        { name: 'design-specs.figma', url: '#', type: 'figma' }
      ]
    },
    { 
      id: 2, 
      title: 'Setup Development Environment', 
      description: 'Configure build tools and development workflow', 
      assignee: 'Mike Wilson', 
      priority: 'medium', 
      dueDate: '2024-01-18',
      status: 'To Do',
      documents: [
        { name: 'env-setup-guide.md', url: '#', type: 'markdown' }
      ]
    },
    { 
      id: 3, 
      title: 'Implement User Authentication', 
      description: 'Add login/logout functionality with JWT tokens', 
      assignee: 'Mike Wilson', 
      priority: 'high', 
      dueDate: '2024-01-25',
      status: 'In Progress',
      documents: [
        { name: 'auth-flow.pdf', url: '#', type: 'pdf' },
        { name: 'security-checklist.docx', url: '#', type: 'document' }
      ]
    }
  ];

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Project Kickoff Meeting',
      content: 'Discussed project scope, timeline, and team responsibilities. Key decisions made regarding technology stack and design approach.',
      createdBy: 'John Doe',
      createdAt: '2024-01-10',
      category: 'meeting'
    },
    {
      id: 2,
      title: 'Design System Requirements',
      content: 'Need to establish consistent design patterns, color schemes, and component library. Should align with brand guidelines.',
      createdBy: 'Jane Smith',
      createdAt: '2024-01-12',
      category: 'design'
    },
    {
      id: 3,
      title: 'Performance Optimization',
      content: 'Focus on Core Web Vitals, lazy loading, and image optimization. Target lighthouse score above 90.',
      createdBy: 'Mike Wilson',
      createdAt: '2024-01-15',
      category: 'development'
    }
  ]);

  const [members, setMembers] = useState(project.members);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'planning': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateNote = () => {
    if (newNote.title && newNote.content) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        createdBy: 'Current User',
        createdAt: new Date().toISOString().split('T')[0],
        category: 'general'
      };
      
      setNotes(prevNotes => [note, ...prevNotes]); // Add to front
      setNewNote({ title: '', content: '' });
      
      toast({
        title: "Note Created",
        description: `"${newNote.title}" has been added to project notes.`,
      });
    }
  };

  const handleAddMember = (memberData) => {
    const newMember = {
      id: Date.now(),
      name: memberData.email.split('@')[0] || 'New Member',
      email: memberData.email,
      role: memberData.role,
      avatar: '',
      tasksAssigned: 0,
      tasksCompleted: 0,
      performance: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      skills: []
    };
    
    setMembers(prevMembers => [...prevMembers, newMember]);
    
    toast({
      title: "Member Added",
      description: `${memberData.email} has been invited to the project.`,
    });
  };

  const handleUpdateRole = (memberId, newRole) => {
    setMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole }
          : member
      )
    );
    
    const member = members.find(m => m.id === memberId);
    toast({
      title: "Role Updated",
      description: `${member?.name}'s role has been updated to ${newRole}.`,
    });
  };

  const handleNoteAction = (noteId, action) => {
    switch (action) {
      case 'edit':
        toast({
          title: "Edit Note",
          description: "Note editing functionality coming soon!",
        });
        break;
      case 'delete':
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        toast({
          title: "Note Deleted",
          description: "Note has been deleted successfully.",
          variant: "destructive",
        });
        break;
      case 'share':
        toast({
          title: "Share Note",
          description: "Note sharing functionality coming soon!",
        });
        break;
      case 'duplicate': {
        const noteToClone = notes.find(n => n.id === noteId);
        if (noteToClone) {
          const clonedNote = {
            ...noteToClone,
            id: Date.now(),
            title: `${noteToClone.title} (Copy)`,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setNotes(prevNotes => [clonedNote, ...prevNotes]);
          toast({
            title: "Note Duplicated",
            description: "Note has been duplicated successfully.",
          });
        }
        break;
      }
      case 'pin':
        toast({
          title: "Pin Note",
          description: "Note pinning functionality coming soon!",
        });
        break;
    }
  };

  const handleTaskAction = (taskId, action) => {
    switch (action) {
      case 'edit':
        toast({
          title: "Edit Task",
          description: "Task editing functionality coming soon!",
        });
        break;
      case 'delete':
        toast({
          title: "Task Deleted",
          description: "Task has been deleted successfully.",
          variant: "destructive",
        });
        break;
      case 'complete':
        toast({
          title: "Task Completed",
          description: "Task has been marked as completed.",
        });
        break;
      case 'assign':
        toast({
          title: "Reassign Task",
          description: "Task reassignment functionality coming soon!",
        });
        break;
      case 'duplicate':
        toast({
          title: "Task Duplicated",
          description: "Task has been duplicated successfully.",
        });
        break;
      case 'reminder':
        toast({
          title: "Reminder Set",
          description: "Reminder has been set for this task.",
        });
        break;
    }
  };

  const handleProjectSettings = (settings) => {
    toast({
      title: "Settings Saved",
      description: "Project settings have been updated successfully.",
    });
    console.log(settings);
    
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      default: return User;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTasks = allTasks.filter(task => {
    if (statusFilter !== 'all' && task.status.toLowerCase().replace(' ', '-') !== statusFilter) return false;
    if (taskFilter !== 'all') {
      if (taskFilter === 'high-priority' && task.priority !== 'high') return false;
      if (taskFilter === 'overdue') {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        if (dueDate >= today) return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/projects')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Project Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority} priority
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Manager</p>
                    <p className="text-sm font-medium">{project.manager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Team Members</p>
                    <p className="text-sm font-medium">{project.members.length} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Progress</p>
                    <p className="text-sm font-medium">{project.progress}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsShareOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium">{project.completedTasks}/{project.totalTasks} tasks completed</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        {/* Kanban Board */}
        <TabsContent value="kanban" className="space-y-6">
          <KanbanBoard />
        </TabsContent>

        {/* Enhanced Members Section */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Team Members</h2>
            <Button 
              onClick={() => setIsAddMemberOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <Card key={member.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 ring-2 ring-white">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription className="font-medium">{member.role}</CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <RoleIcon className="h-3 w-3 text-purple-600" />
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem onClick={() => {
                            setSelectedMember(member);
                            setIsRoleUpdateOpen(true);
                          }}>
                            <Shield className="h-4 w-4 mr-2" />
                            Update Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </div>
                      
                      {/* Skills */}
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Task Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-600">Assigned</p>
                          <p className="text-lg font-semibold text-blue-600">{member.tasksAssigned}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Completed</p>
                          <p className="text-lg font-semibold text-emerald-600">{member.tasksCompleted}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Rate</p>
                          <p className="text-lg font-semibold text-purple-600">
                            {Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Task Completion</span>
                          <span>{Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(member.tasksCompleted / member.tasksAssigned) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-600 pt-2 border-t">
                        <span>Joined: {new Date(member.joinedDate).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{member.performance}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Enhanced Notes */}
        <TabsContent value="notes" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-semibold">Project Notes</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Create Note */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Plus className="h-5 w-5" />
                Create New Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Textarea
                placeholder="Note content..."
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                rows={3}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button 
                onClick={handleCreateNote} 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </CardContent>
          </Card>

          {/* Notes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <NoteActions
                      onEdit={() => handleNoteAction(note.id, 'edit')}
                      onDelete={() => handleNoteAction(note.id, 'delete')}
                      onShare={() => handleNoteAction(note.id, 'share')}
                      onDuplicate={() => handleNoteAction(note.id, 'duplicate')}
                      onPin={() => handleNoteAction(note.id, 'pin')}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{note.content}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {note.createdBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced List View with Filters */}
        <TabsContent value="list" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-semibold">Task List</h2>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="to-do">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={taskFilter} onValueChange={setTaskFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="high-priority">High Priority</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium">Task Name</th>
                      <th className="text-left p-4 font-medium">Description</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Assigned To</th>
                      <th className="text-left p-4 font-medium">Priority</th>
                      <th className="text-left p-4 font-medium">Due Date</th>
                      <th className="text-left p-4 font-medium">Documents</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task, index) => (
                      <tr key={task.id} className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="p-4 font-medium">{task.title}</td>
                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                          {task.description}
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">
                            {task.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          {task.documents && task.documents.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                                {task.documents.length} file{task.documents.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">No files</span>
                          )}
                        </td>
                        <td className="p-4">
                          <TaskListActions
                            onEdit={() => handleTaskAction(task.id, 'edit')}
                            onDelete={() => handleTaskAction(task.id, 'delete')}
                            onComplete={() => handleTaskAction(task.id, 'complete')}
                            onAssign={() => handleTaskAction(task.id, 'assign')}
                            onDuplicate={() => handleTaskAction(task.id, 'duplicate')}
                            onSetReminder={() => handleTaskAction(task.id, 'reminder')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
      />

      <RoleUpdateDialog
        open={isRoleUpdateOpen}
        onOpenChange={setIsRoleUpdateOpen}
        member={selectedMember}
        onUpdateRole={handleUpdateRole}
      />

      <ProjectSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        project={project}
        onSave={handleProjectSettings}
      />

      <ProjectShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        project={project}
      />
    </div>
  );
};

export default ProjectDetail;