import { 
  Kanban, 
  FolderTree, 
  Users, 
  Clock, 
  Shield, 
  Zap,
  BarChart3,
  Cloud,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: Kanban,
      title: "Kanban Boards",
      description: "Visual project management with drag-and-drop task boards to track progress effortlessly.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FolderTree,
      title: "Smart File Organization",
      description: "Intelligent file management with AI-powered categorization and powerful search capabilities.",
      gradient: "from-orange-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Add team members, assign roles, and collaborate seamlessly on projects and files.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Built-in time tracking to monitor project progress and team productivity.",
      gradient: "from-teal-500 to-blue-500"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive insights and reports to track project performance and team efficiency.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Secure cloud storage with automatic sync across all your devices and team members.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Integrated messaging system for instant communication within projects and teams.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encryption, access controls, and compliance standards.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate repetitive tasks and workflows to boost productivity and reduce manual work.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Powerful project management and file organization tools designed to streamline 
            your workflow and boost team productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border shadow-md relative overflow-hidden hover:card-glow"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardHeader className="pb-4 relative z-10">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient} p-0.5`}>
                  <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;