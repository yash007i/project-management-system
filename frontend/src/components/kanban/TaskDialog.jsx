import React, { useState, useRef } from 'react';
import { Calendar, X, Upload, Plus, Flag, CircleDot, CheckCircle, Clock, FileText, Image, File } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';


const TaskDialog = ({
  open,
  onOpenChange,
  onCreateTask,
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    email: initialData?.email || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || '',
    attachments: initialData?.attachments || []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments = Array.from(files).map(file => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const type = ['pdf', 'doc', 'docx'].includes(fileExtension) ? 'document' : 
                   ['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension) ? 'image' : 'file';
      
      return {
        name: file.name,
        url: URL.createObjectURL(file),
        type
      };
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onCreateTask(formData);
      onOpenChange(false);
      // Reset form if creating new task
      if (mode === 'create') {
        setFormData({
          title: '',
          description: '',
          email: '',
          status: 'todo',
          priority: 'medium',
          dueDate: '',
          attachments: []
        });
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        email: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        attachments: []
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return <CircleDot className="h-4 w-4 text-yellow-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <CircleDot className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Flag className="h-4 w-4 text-red-500" />;
      case 'medium': return <Flag className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Flag className="h-4 w-4 text-gray-500" />;
      default: return <Flag className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="h-6 w-6 text-blue-500" />
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Task Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What needs to be done?"
              className="bg-white/70 border-gray-200 focus:border-blue-400 text-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📄 Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the task in detail..."
              className="bg-white/70 border-gray-200 focus:border-blue-400 min-h-[100px]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👤 Assignee Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="assignee@example.com"
              className="bg-white/70 border-gray-200 focus:border-blue-400"
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-3 bg-white/70 border border-gray-200 rounded-md focus:border-blue-400 appearance-none text-gray-700"
                >
                  <option value="todo">📋 To Do</option>
                  <option value="in-progress">⏳ In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {getStatusIcon(formData.status)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Priority
              </label>
              <div className="relative">
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full p-3 bg-white/70 border border-gray-200 rounded-md focus:border-blue-400 appearance-none text-gray-700"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {getPriorityIcon(formData.priority)}
                </div>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="bg-white/70 border-gray-200 focus:border-blue-400"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Upload className="h-4 w-4 text-purple-500" />
              Attachments
            </label>
            
            {/* File Upload */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.md"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full bg-white/70 hover:bg-white border-dashed border-2 border-gray-300 hover:border-blue-400 py-8"
              >
                <Upload className="h-6 w-6 mr-2 text-purple-500" />
                Click to upload files or drag and drop
              </Button>
            </div>

            {/* Existing attachments */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">📎 Attached Files:</p>
                {formData.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      {getFileIcon(attachment.type)}
                      <span className="text-sm font-medium text-gray-700">{attachment.name}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-red-100 text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-white/70 hover:bg-white border-gray-300 text-gray-700"
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
          >
            {mode === 'create' ? '✨ Create Task' : '💾 Update Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;