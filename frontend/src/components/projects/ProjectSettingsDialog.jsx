import React, { useState } from 'react';
import { Settings, Save, Trash2, Users, Lock, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProjectSettingsDialog = ({
  open,
  onOpenChange,
  project,
  onSave
}) => {
  const [settings, setSettings] = useState({
    name: project?.name || '',
    description: project?.description || '',
    visibility: 'private',
    notifications: true,
    autoArchive: false,
    allowComments: true
  });

  const handleSave = () => {
    onSave(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Project Settings</DialogTitle>
              <DialogDescription>
                Configure your project preferences and permissions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Project Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({...settings, description: e.target.value})}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Project Visibility</Label>
              <Select value={settings.visibility} onValueChange={(value) => setSettings({...settings, visibility: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Private
                    </div>
                  </SelectItem>
                  <SelectItem value="team">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Only
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Public
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-gray-900">Preferences</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-500">Receive updates about project activity</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Auto-archive completed tasks</Label>
                <p className="text-xs text-gray-500">Automatically move completed tasks to archive</p>
              </div>
              <Switch
                checked={settings.autoArchive}
                onCheckedChange={(checked) => setSettings({...settings, autoArchive: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Allow Comments</Label>
                <p className="text-xs text-gray-500">Team members can comment on tasks</p>
              </div>
              <Switch
                checked={settings.allowComments}
                onCheckedChange={(checked) => setSettings({...settings, allowComments: checked})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSettingsDialog;