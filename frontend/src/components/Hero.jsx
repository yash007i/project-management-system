
import { ArrowRight, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8">
            <Star className="h-4 w-4 mr-2" />
            Trusted by 10,000+ teams worldwide
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Your Ultimate
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {" "}Cloud Workspace
            </span>
            <br />
            For Modern Teams
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-foreground/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            Streamline your workflow with CloudCache - the all-in-one platform combining 
            powerful project management tools and intelligent file organization in the cloud.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-blue-400 to-blue-600 text-lg px-8 py-4 h-auto hover:scale-105 hover:shadow-lg transition-transform duration-200  ">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl shadow-2xl border p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Project Management Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground text-left">Project Management</h3>
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Website Redesign</span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Active</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-2 rounded text-center">To Do</div>
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-2 rounded text-center">In Progress</div>
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 p-2 rounded text-center">Done</div>
                    </div>
                  </div>
                </div>

                {/* File Organization Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground text-left">File Organization</h3>
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span>Documents</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 bg-purple-400 rounded"></div>
                      <span>Images</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 bg-violet-400 rounded"></div>
                      <span>Resources</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;