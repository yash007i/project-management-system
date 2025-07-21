import React, { useState } from 'react';
import { Shield, User, Crown, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const RoleUpdateDialog = ({ 
  open, 
  onOpenChange, 
  member,
  onUpdateRole 
}) => {
  const [selectedRole, setSelectedRole] = useState(member?.role || 'member');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { 
      value: 'member', 
      label: 'Member', 
      icon: User, 
      description: 'Can view and edit tasks, participate in discussions',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    { 
      value: 'admin', 
      label: 'Project Admin', 
      icon: Shield, 
      description: 'Can manage project settings, add/remove members, and assign tasks',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    { 
      value: 'owner', 
      label: 'Owner', 
      icon: Crown, 
      description: 'Full access to project including deletion and ownership transfer',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  React.useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
  }, [member]);

  const handleUpdateRole = async () => {
    if (!member || selectedRole === member.role) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onUpdateRole(member.id, selectedRole);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Update Member Role
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Change the role and permissions for this team member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Member Info */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{member.name}</h4>
              <p className="text-sm text-gray-600 truncate">{member.email}</p>
              <Badge className={`mt-1 ${roles.find(r => r.value === member.role)?.color || 'bg-gray-100 text-gray-800'}`}>
                Current: {roles.find(r => r.value === member.role)?.label || member.role}
              </Badge>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Select New Role
            </Label>
            <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <div key={role.value} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={role.value} id={role.value} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={role.value} className="cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <span className="font-medium text-gray-900">{role.label}</span>
                          {selectedRole === role.value && (
                            <Badge className={`ml-auto ${role.color}`}>Selected</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{role.description}</p>
                      </Label>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              disabled={isLoading || selectedRole === member.role}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Update Role
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleUpdateDialog;