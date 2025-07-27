import React from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, User, Shield, Crown } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const AddMemberDialog = ({ open, onOpenChange, onAddMember }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  // const email = watch('email');
  const role = watch('role');

  const roles = [
    {
      value: 'member',
      label: 'Member',
      icon: User,
      description: 'Can view and edit tasks',
    },
    {
      value: 'admin',
      label: 'Project Admin',
      icon: Shield,
      description: 'Can manage project settings and members',
    },
    {
      value: 'owner',
      label: 'Owner',
      icon: Crown,
      description: 'Full access to project',
    },
  ];

  const getRoleIcon = (roleValue) => {
    const roleData = roles.find((r) => r.value === roleValue);
    return roleData?.icon || User;
  };

  const getRoleColor = (roleValue) => {
    switch (roleValue) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    onAddMember(data); // { email, role }
    reset(); // Reset form fields
    onOpenChange(false); // Close dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Team Member
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Invite a new member to join this project by entering their email address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setValue('role', value)}
            >
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {roles.map((roleOption) => {
                  const IconComponent = roleOption.icon;
                  return (
                    <SelectItem key={roleOption.value} value={roleOption.value}>
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{roleOption.label}</div>
                          <div className="text-xs text-gray-500">
                            {roleOption.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Badge className={getRoleColor(role)}>
                {React.createElement(getRoleIcon(role), { className: 'h-3 w-3 mr-1' })}
                {roles.find((r) => r.value === role)?.label}
              </Badge>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
