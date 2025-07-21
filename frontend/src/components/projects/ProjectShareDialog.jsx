import React, { useState } from 'react';
import { Share2, Copy, Mail, Link, Check } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProjectShareDialog = ({
  open,
  onOpenChange,
  project
}) => {
  const [shareMethod, setShareMethod] = useState('link');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/projects/${project?.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleSendEmail = () => {
    const subject = `Invited to collaborate on ${project?.name}`;
    const body = `${message}\n\nJoin the project: ${shareUrl}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Share Project</DialogTitle>
              <DialogDescription>
                Invite others to collaborate on "{project?.name}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Share Method</Label>
            <Select value={shareMethod} onValueChange={setShareMethod}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="link">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Copy Link
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {shareMethod === 'link' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Project Link</Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-gray-50"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="px-3"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && (
                <p className="text-sm text-green-600">Link copied to clipboard!</p>
              )}
            </div>
          )}

          {shareMethod === 'email' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            {shareMethod === 'email' ? (
              <Button
                onClick={handleSendEmail}
                disabled={!email}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invite
              </Button>
            ) : (
              <Button
                onClick={handleCopyLink}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectShareDialog;