
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Share2,
  Copy,
  Mail,
  Link,
  Users,
  X,
  Check
} from 'lucide-react';


export const ShareDialog = ({
  open,
  onOpenChange,
  projectName,
  projectId,
}) => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const projectUrl = `${window.location.origin}/projects/${projectId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "Project link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
      console.log(err);      
    }
  };

  const sendInvite = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send an email invitation
    toast({
      title: "Invitation sent!",
      description: `Invitation sent to ${email}`,
    });
    setEmail('');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Invitation to collaborate on ${projectName}`);
    const body = encodeURIComponent(
      `You've been invited to collaborate on the project "${projectName}". Click the link below to view the project:\n\n${projectUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-green-50/80 to-blue-50/80 dark:from-green-950/20 dark:to-blue-950/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Share2 className="h-5 w-5 text-primary" />
            Share Project
          </DialogTitle>
          <DialogDescription>
            Share "{projectName}" with your team members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Link */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Link className="h-4 w-4" />
              Project Link
            </label>
            <div className="flex gap-2">
              <Input
                value={projectUrl}
                readOnly
                className="bg-muted/50 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 min-w-fit"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Email Invitation */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Mail className="h-4 w-4" />
              Invite by Email
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
                onKeyPress={(e) => e.key === 'Enter' && sendInvite()}
              />
              <Button
                onClick={sendInvite}
                className="gradient-primary text-white flex items-center gap-2 min-w-fit"
              >
                <Mail className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4" />
              Quick Share
            </label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email App
              </Button>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Permissions Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Access Level</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">View & Comment</Badge>
              <Badge variant="secondary">Edit Tasks</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Shared users can view the project and participate in discussions.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};