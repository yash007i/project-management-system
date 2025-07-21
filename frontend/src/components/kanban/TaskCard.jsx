import React from 'react';
import { 
  Calendar, 
  Flag, 
  MessageSquare,
  Paperclip,
  ExternalLink,
  FileText,
  Image,
  File
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import TaskActions from './TaskActions';


const TaskCard = ({ 
  task, 
  // index, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onSetReminder,
  onDragStart
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    onDragStart();
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a proper drag preview
    const dragElement = e.currentTarget ;
    const rect = dragElement.getBoundingClientRect();
    
    // Clone the element for drag preview
    const dragPreview = dragElement.cloneNode(true) ;
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    dragPreview.style.left = '-1000px';
    dragPreview.style.width = rect.width + 'px';
    dragPreview.style.transform = 'rotate(2deg) scale(1.02)';
    dragPreview.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
    dragPreview.style.borderRadius = '12px';
    dragPreview.style.opacity = '0.9';
    dragPreview.style.zIndex = '9999';
    dragPreview.style.backgroundColor = 'white';
    dragPreview.style.border = '2px solid #3b82f6';
    
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, rect.width / 2, rect.height / 2);
    
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    const className = "h-3 w-3";
    switch (priority) {
      case 'high': return <Flag className={`${className} text-red-500`} />;
      case 'medium': return <Flag className={`${className} text-yellow-500`} />;
      case 'low': return <Flag className={`${className} text-gray-500`} />;
      default: return <Flag className={`${className} text-gray-500`} />;
    }
  };

  const getDocumentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'figma':
        return <File className="h-4 w-4 text-purple-500" />;
      case 'document':
      case 'docx':
      case 'doc':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'markdown':
      case 'md':
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleDocumentClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`cursor-grab active:cursor-grabbing select-none transition-all duration-200 ${
        isDragging 
          ? 'opacity-60 scale-95 rotate-1 z-50' 
          : 'hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02]'
      }`}
    >
      <Card className={`group bg-white border-0 shadow-sm transition-all duration-200 ${
        isDragging 
          ? 'ring-2 ring-blue-400 shadow-2xl bg-blue-50' 
          : 'hover:ring-2 hover:ring-blue-200 hover:shadow-lg'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 pr-2">
              {task.title}
            </CardTitle>
            <TaskActions
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onSetReminder={onSetReminder}
            />
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {task.description}
          </p>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Labels */}
          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map((label, labelIndex) => (
                <Badge 
                  key={labelIndex} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 bg-gray-50"
                >
                  {label}
                </Badge>
              ))}
            </div>
          )}

          {/* Priority Badge */}
          <div>
            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
              <div className="flex items-center gap-1">
                {getPriorityIcon(task.priority)}
                {task.priority}
              </div>
            </Badge>
          </div>

          {/* Documents Section */}
          {task.documents && task.documents.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Paperclip className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Documents</span>
              </div>
              <div className="space-y-1">
                {task.documents.slice(0, 3).map((doc, docIndex) => (
                  <div 
                    key={docIndex} 
                    className="flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-gray-100 transition-colors group/doc"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentClick(doc.url);
                    }}
                  >
                    {getDocumentIcon(doc.type)}
                    <span className="text-xs text-blue-600 hover:underline truncate flex-1">
                      {doc.name}
                    </span>
                    <ExternalLink className="h-3 w-3 text-gray-500 opacity-0 group-hover/doc:opacity-100 transition-opacity" />
                  </div>
                ))}
                {task.documents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-6">
                    +{task.documents.length - 3} more documents
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Task Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 ring-2 ring-white">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                  {task.assignee.initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {task.comments > 0 && (
                <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                  <MessageSquare className="h-3 w-3" />
                  <span>{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                  <Paperclip className="h-3 w-3" />
                  <span>{task.attachments}</span>
                </div>
              )}
              <div className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;