import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Upload, 
  FolderPlus, 
  Folder, 
  File, 
  Star, 
  Trash2, 
  MoreHorizontal,
  ChevronRight,
  Home,
  Settings,
  Search,
  FolderOpen,
  FileText,
  Image,
  Play,
  Download,
  Users,
  Building2,
  Calendar,
  X,
  Check,
  AlertTriangle,
  MousePointer2,
  Grid3X3,
  List,
  CloudUpload
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';


const Files = () => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  // Removed unused selectedProjectName state
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('files');
  const [isDragOver, setIsDragOver] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const projects = [
    { id: '1', name: 'E-commerce Platform', description: 'Online store development', icon: Building2 },
    { id: '2', name: 'Mobile App Design', description: 'UI/UX design project', icon: Users },
    { id: '3', name: 'Marketing Campaign', description: 'Brand awareness campaign', icon: Calendar },
    { id: '4', name: 'Data Analytics', description: 'Business intelligence dashboard', icon: Settings }
  ];

  const getCurrentItems = () => {
    let current = files;
    for (const pathId of currentPath) {
      const folder = current.find(item => item._id === pathId && item.isFolder);
      if (folder && folder.children) {
        current = folder.children;
      }
    }
    return current.filter(item => 
      !item.isTrash && 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStarredItems = () => {
    const getAllItems = (items) => {
      let allItems = [];
      items.forEach(item => {
        allItems.push(item);
        if (item.children) {
          allItems = allItems.concat(getAllItems(item.children));
        }
      });
      return allItems;
    };
    return getAllItems(files).filter(item => item.isStarred && !item.isTrash);
  };

  const getTrashItems = () => {
    const getAllItems = (items) => {
      let allItems = [];
      items.forEach(item => {
        allItems.push(item);
        if (item.children) {
          allItems = allItems.concat(getAllItems(item.children));
        }
      });
      return allItems;
    };
    return getAllItems(files).filter(item => item.isTrash);
  };

  const getItemCounts = (items) => {
    const folders = items.filter(item => item.isFolder).length;
    const files = items.filter(item => !item.isFolder).length;
    return { folders, files };
  };

  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(projectId);
      setCurrentPath([]); // Reset to root when project changes
      
      // Create root folder for project if it doesn't exist
      const existingFolder = files.find(f => f.name === project.name && f.isFolder);
      if (!existingFolder) {
        const newFolder = {
          _id: `project-${projectId}`,
          name: project.name,
          path: `/${project.name}`,
          size: 0,
          type: 'folder',
          fileUrl: '',
          userId: 'current-user',
          isFolder: true,
          isStarred: false,
          isTrash: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          children: []
        };
        setFiles(prev => [...prev, newFolder]);
      }
      
      toast({
        title: "Project Selected",
        description: `Successfully switched to ${project.name}`,
      });
    }
    setIsProjectDialogOpen(false);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        _id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        path: `/${currentPath.join('/')}/${newFolderName.trim()}`,
        size: 0,
        type: 'folder',
        fileUrl: '',
        userId: 'current-user',
        parentId: currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined,
        isFolder: true,
        isStarred: false,
        isTrash: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      };

      if (currentPath.length === 0) {
        setFiles(prev => [...prev, newFolder]);
      } else {
        setFiles(prev => {
          const updateFolder = (items, path) => {
            if (path.length === 0) return items;
            
            return items.map(item => {
              if (item._id === path[0] && item.isFolder) {
                if (path.length === 1) {
                  return { ...item, children: [...(item.children || []), newFolder] };
                } else {
                  return { ...item, children: updateFolder(item.children || [], path.slice(1)) };
                }
              }
              return item;
            });
          };
          
          return updateFolder(prev, currentPath);
        });
      }
      
      setNewFolderName('');
      setIsNewFolderDialogOpen(false);
      
      toast({
        title: "Folder Created",
        description: `Successfully created folder "${newFolderName.trim()}"`,
      });
    }
  };

  const handleFilesUpload = (uploadedFiles) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    Array.from(uploadedFiles).forEach(file => {
      const getFileType = (fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
        if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video';
        if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) return 'document';
        return 'file';
      };

      const newFile = {
        _id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        path: `/${currentPath.join('/')}/${file.name}`,
        size: file.size,
        type: file.type || getFileType(file.name),
        fileUrl: URL.createObjectURL(file),
        userId: 'current-user',
        parentId: currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined,
        isFolder: false,
        isStarred: false,
        isTrash: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTimeout(() => {
        if (currentPath.length === 0) {
          setFiles(prev => [...prev, newFile]);
        } else {
          setFiles(prev => {
            const updateFolder = (items, path) => {
              if (path.length === 0) return items;
              
              return items.map(item => {
                if (item._id === path[0] && item.isFolder) {
                  if (path.length === 1) {
                    return { ...item, children: [...(item.children || []), newFile] };
                  } else {
                    return { ...item, children: updateFolder(item.children || [], path.slice(1)) };
                  }
                }
                return item;
              });
            };
            
            return updateFolder(prev, currentPath);
          });
        }
        
        toast({
          title: "File Uploaded",
          description: `Successfully uploaded "${file.name}"`,
        });
      }, 2000);
    });
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      handleFilesUpload(uploadedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFilesUpload(files);
    }
  };

  const handleItemAction = (itemId, action) => {
    const updateItem = (items) => {
      return items.map(item => {
        if (item._id === itemId) {
          const updatedItem = { 
            ...item, 
            isStarred: action === 'star' ? !item.isStarred : item.isStarred,
            isTrash: action === 'trash' ? !item.isTrash : item.isTrash
          };
          
          toast({
            title: action === 'star' ? (updatedItem.isStarred ? "Added to Starred" : "Removed from Starred") : "Moved to Trash",
            description: `"${item.name}" ${action === 'star' ? (updatedItem.isStarred ? 'has been starred' : 'has been unstarred') : 'has been moved to trash'}`,
          });
          
          return updatedItem;
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };

    setFiles(updateItem);
  };

  const handlePermanentDelete = (itemId) => {
    const deleteItem = (items) => {
      return items.filter(item => {
        if (item._id === itemId) {
          toast({
            title: "Permanently Deleted",
            description: `"${item.name}" has been permanently deleted`,
            variant: "destructive"
          });
          return false;
        }
        if (item.children) {
          return { ...item, children: deleteItem(item.children) };
        }
        return true;
      });
    };

    setFiles(deleteItem);
  };

  const handleDownload = (item) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = item.fileUrl;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading "${item.name}"`,
    });
  };

  const handleFileOpen = (item) => {
    if (!item.isFolder) {
      // Open file in new tab
      window.open(item.fileUrl, '_blank');
    }
  };

  const handleFolderClick = (folderId) => {
    setCurrentPath(prev => [...prev, folderId]);
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
  };

  const getFolderFromPath = (pathArray, items = files) => {
    if (pathArray.length === 0) return null;
    
    let current = items;
    for (let i = 0; i < pathArray.length; i++) {
      const folder = current.find(item => item._id === pathArray[i] && item.isFolder);
      if (!folder) return null;
      if (i === pathArray.length - 1) return folder;
      current = folder.children || [];
    }
    return null;
  };

  const renderBreadcrumb = () => (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPath([])}
        className="p-2 hover:bg-gray-100"
      >
        <Home className="h-4 w-4" />
      </Button>
      {currentPath.map((pathId, index) => {
        const folder = getFolderFromPath(currentPath.slice(0, index + 1));
        return (
          <React.Fragment key={pathId}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBreadcrumbClick(index)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              {folder?.name || 'Unknown'}
            </Button>
          </React.Fragment>
        );
      })}
    </div>
  );

  const getFileIcon = (item) => {
    if (item.isFolder) {
      return <FolderOpen className="h-5 w-5 text-blue-500" />;
    }
    
    const type = item.type.toLowerCase();
    if (type.includes('image')) return <Image className="h-5 w-5 text-green-500" />;
    if (type.includes('video')) return <Play className="h-5 w-5 text-red-500" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-5 w-5 text-orange-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileItem = (item) => {
    if (viewMode === 'list') {
      return (
        <div key={item._id} className="group hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center justify-between p-4">
            <div 
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              onClick={() => item.isFolder ? handleFolderClick(item._id) : null}
              onDoubleClick={() => !item.isFolder ? handleFileOpen(item) : null}
            >
              {getFileIcon(item)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{item.isFolder ? 'Folder' : formatFileSize(item.size)}</span>
                  <span>•</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border">
                  <DropdownMenuItem onClick={() => handleItemAction(item._id, 'star')}>
                    <Star className="h-4 w-4 mr-2" />
                    {item.isStarred ? 'Remove from Starred' : 'Add to Starred'}
                  </DropdownMenuItem>
                  {!item.isFolder && (
                    <DropdownMenuItem onClick={() => handleDownload(item)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleItemAction(item._id, 'trash')}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Move to Trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card key={item._id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200 hover:border-gray-300 relative h-full">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div 
              className="flex items-center gap-3 flex-1 min-w-0"
              onClick={() => item.isFolder ? handleFolderClick(item._id) : null}
              onDoubleClick={() => !item.isFolder ? handleFileOpen(item) : null}
            >
              {getFileIcon(item)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">{item.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border">
                  <DropdownMenuItem onClick={() => handleItemAction(item._id, 'star')}>
                    <Star className="h-4 w-4 mr-2" />
                    {item.isStarred ? 'Remove from Starred' : 'Add to Starred'}
                  </DropdownMenuItem>
                  {!item.isFolder && (
                    <DropdownMenuItem onClick={() => handleDownload(item)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleItemAction(item._id, 'trash')}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Move to Trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{item.isFolder ? 'Folder' : formatFileSize(item.size)}</span>
              <span>•</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTrashItem = (item) => {
    if (viewMode === 'list') {
      return (
        <div key={item._id} className="group hover:bg-red-50 transition-colors duration-200 border-b border-red-100 last:border-b-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getFileIcon(item)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{item.isFolder ? 'Folder' : formatFileSize(item.size)}</span>
                  <span>•</span>
                  <span>Deleted {new Date(item.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleItemAction(item._id, 'trash')}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3"
              >
                <MousePointer2 className="h-3 w-3 mr-1" />
                Restore
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Permanently Delete
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete "{item.name}"? This action cannot be undone and the file will be lost forever.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handlePermanentDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card key={item._id} className="group hover:shadow-lg transition-all duration-200 border-red-200 hover:border-red-300 relative h-full">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getFileIcon(item)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">{item.name}</p>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span>{item.isFolder ? 'Folder' : formatFileSize(item.size)}</span>
              <span>•</span>
              <span>Deleted {new Date(item.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleItemAction(item._id, 'trash')}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3 text-xs"
              >
                <MousePointer2 className="h-3 w-3 mr-1" />
                Restore
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Permanently Delete
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete "{item.name}"? This action cannot be undone and the file will be lost forever.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handlePermanentDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const currentItems = getCurrentItems();
  const starredItems = getStarredItems();
  const trashItems = getTrashItems();

  const currentCounts = getItemCounts(currentItems);
  const starredCounts = getItemCounts(starredItems);
  const trashCounts = getItemCounts(trashItems);

  return (
    <div 
      className="min-h-screen bg-gray-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <CloudUpload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900">Drop files here to upload</p>
            <p className="text-sm text-gray-600 mt-2">Release to upload your files</p>
          </div>
        </div>
      )}
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Files</h2>
            
            {/* Drag & Drop Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag files here or click to upload</p>
            </div>
            
            {/* Upload Section */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
              {isUploading && (
                <div className="mt-3 space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Navigation */}
            <nav className="space-y-2">
              <Button 
                variant={activeTab === 'files' ? 'default' : 'ghost'} 
                className={`w-full ${activeTab === 'files' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'ghost'} justify-start`}
                onClick={() => setActiveTab('files')}
              >
                <Folder className="h-4 w-4 mr-2" />
                My Files
                <Badge variant="secondary" className="ml-auto">
                  {currentCounts.folders + currentCounts.files}
                </Badge>
              </Button>
              <Button 
                variant={activeTab === 'starred' ? 'default' : 'ghost'} 
                className={`w-full ${activeTab === 'starred' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'ghost'} justify-start`}
                onClick={() => setActiveTab('starred')}
              >
                <Star className="h-4 w-4 mr-2" />
                Starred
                <Badge variant="secondary" className="ml-auto">
                  {starredCounts.folders + starredCounts.files}
                </Badge>
              </Button>
              <Button 
                variant={activeTab === 'trash' ? 'default' : 'ghost'} 
                className={`w-full ${activeTab === 'trash' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'ghost'} justify-start`}
                onClick={() => setActiveTab('trash')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Trash
                <Badge variant="secondary" className="ml-auto">
                  {trashCounts.folders + trashCounts.files}
                </Badge>
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0' : 'h-8 w-8 p-0'} `}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0' : 'h-8 w-8 p-0'} `}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Show project selection button only in root */}
              {currentPath.length === 0 && (
                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="min-w-[200px]">
                      <Settings className="h-4 w-4 mr-2" />
                      Select Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Select Project
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Settings className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-800">
                          Choose a project to organize your files. A root folder will be created for the selected project.
                        </p>
                      </div>
                      <div className="space-y-2">
                        {projects.map(project => (
                          <Button
                            key={project.id}
                            variant={selectedProject === project.id ? "default" : "ghost"}
                            className="w-full justify-start h-auto p-4"
                            onClick={() => handleProjectSelect(project.id)}
                          >
                            <div className="flex items-center gap-3">
                              <project.icon className="h-5 w-5" />
                              <div className="text-left">
                                <p className="font-medium">{project.name}</p>
                                <p className="text-sm text-gray-500">{project.description}</p>
                              </div>
                            </div>
                            {selectedProject === project.id && (
                              <Check className="h-4 w-4 ml-auto" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                  className={"bg-blue-600 hover:bg-blue-700 text-white"}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Enter folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateFolder} 
                      className={"bg-blue-600 hover:bg-blue-700 text-white"}
                      disabled={!newFolderName.trim()}>
                        Create Folder
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'files' && (
            <div>
              {renderBreadcrumb()}
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{currentCounts.folders} folders</span>
                  <span>{currentCounts.files} files</span>
                </div>
              </div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {currentItems.map(renderFileItem)}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {currentItems.map(renderFileItem)}
                </div>
              )}
              {currentItems.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No files or folders yet</p>
                  <p className="text-sm text-gray-400">Upload files or create folders to get started</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'starred' && (
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{starredCounts.folders} folders</span>
                  <span>{starredCounts.files} files</span>
                </div>
              </div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {starredItems.map(renderFileItem)}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {starredItems.map(renderFileItem)}
                </div>
              )}
              {starredItems.length === 0 && (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No starred items</p>
                  <p className="text-sm text-gray-400">Star files and folders to find them easily</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trash' && (
            <div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-medium">Items in trash will be automatically deleted after 30 days</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{trashCounts.folders} folders</span>
                  <span>{trashCounts.files} files</span>
                </div>
              </div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {trashItems.map(renderTrashItem)}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {trashItems.map(renderTrashItem)}
                </div>
              )}
              {trashItems.length === 0 && (
                <div className="text-center py-12">
                  <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Trash is empty</p>
                  <p className="text-sm text-gray-400">Deleted files will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;