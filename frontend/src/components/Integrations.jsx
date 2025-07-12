import { Slack, Github, Chrome, Smartphone, Database, Mail, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Integrations = () => {
  const integrations = [
    {
      icon: Slack,
      name: "Slack",
      description: "Get notifications and updates directly in your Slack channels",
      category: "Communication"
    },
    {
      icon: Github,
      name: "GitHub",
      description: "Sync your repositories and track development progress",
      category: "Development"
    },
    {
      icon: Chrome,
      name: "Google Workspace",
      description: "Seamless integration with Google Drive, Docs, and Sheets",
      category: "Productivity"
    },
    {
      icon: Calendar,
      name: "Calendar Apps",
      description: "Sync with Google Calendar, Outlook, and other calendar apps",
      category: "Scheduling"
    },
    {
      icon: Mail,
      name: "Email Integration",
      description: "Transform emails into tasks and keep everything organized",
      category: "Communication"
    },
    {
      icon: Database,
      name: "Database Tools",
      description: "Connect with popular databases and data visualization tools",
      category: "Data"
    },
    {
      icon: Smartphone,
      name: "Mobile Apps",
      description: "Native iOS and Android apps for on-the-go productivity",
      category: "Mobile"
    },
    {
      icon: FileText,
      name: "Document Tools",
      description: "Integration with Microsoft Office, Notion, and other document tools",
      category: "Documentation"
    }
  ];

  const categories = ["Communication", "Development", "Productivity", "Scheduling", "Data", "Mobile", "Documentation"];

  return (
    <section id="integrations" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Integrations
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Connect CloudCache with your favorite tools and services. 
            Build a workflow that works perfectly for your team.
          </p>
        </div>

        {/* Integration Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <integration.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  {integration.name}
                </CardTitle>
                <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full w-fit mx-auto">
                  {integration.category}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground text-sm">
                  {integration.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-card-foreground mb-4">
            Don't see your favorite tool?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly adding new integrations. Request a new integration 
            or build your own using our powerful API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg">
              Request Integration
            </Button>
            <Button variant="outline">
              View API Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;