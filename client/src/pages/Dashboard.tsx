import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { PanicButton } from "@/components/PanicButton";
import { MapComponent } from "@/components/MapComponent"; // NEW: Import map component
import { InteractiveMap } from "@/components/InteractiveMap";
import { ScamDetailsUpdate } from "@/components/ScamDetailsUpdate";
import { ReviewIncentives } from "@/components/ReviewIncentives";
import { AuthorityMessenger } from "@/components/AuthorityMessenger";
import { LostAndFound } from "@/components/LostAndFound";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  CreditCard,
  AlertTriangle,
  Bot,
  MapPin,
  Clock,
  Map,
  MessageSquare,
  Star,
  Phone,
  Search
} from "lucide-react";

interface User {
  id: string;
  touristId: string;
  fullName: string;
  profileCompleted: boolean;
}

const dashboardItems = [
  {
    title: "Tourist Profile",
    description: "Manage your travel information and emergency contacts",
    icon: Users,
    href: "/profile",
    color: "bg-primary",
    urgent: false,
  },
  {
    title: "Digital Tourist ID",
    description: "Your blockchain-based travel identification",
    icon: CreditCard,
    href: "/digital-id",
    color: "bg-accent",
    urgent: false,
  },
  {
    title: "Travel Safety Hub",
    description: "AI-powered safety insights for North East states",
    icon: Shield,
    href: "/safety-hub",
    color: "bg-green-600",
    urgent: false,
  },
  {
    title: "Scam Awareness",
    description: "Local scam alerts and verified price information in ₹",
    icon: AlertTriangle,
    href: "/scam-awareness",
    color: "bg-orange-600",
    urgent: true,
  },
  {
    title: "AI Travel Assistant",
    description: "Get personalized safety recommendations for Seven Sisters",
    icon: Bot,
    href: "/ai-assistant",
    color: "bg-primary",
    urgent: false,
  },
  {
    title: "Traveler Connect",
    description: "Connect with fellow travelers exploring North East",
    icon: Users,
    href: "/traveler-connect",
    color: "bg-accent",
    urgent: false,
  },
];

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary to-blue-800 text-primary-foreground py-16"
      >
        {/* Scenic view of Kaziranga National Park */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" 
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🛡️ Explore North East India Safely
          </h1>
          <p className="text-lg md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto">
            Your AI-powered safety companion for discovering the seven sisters states with emergency response,
            real-time alerts, and community protection
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
              <MapPin className="w-4 h-4 mr-2" />
              GPS Protected
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
              <Clock className="w-4 h-4 mr-2" />
              24/7 Monitoring
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
              <Bot className="w-4 h-4 mr-2" />
              AI-Powered Alerts
            </Badge>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">98.7%</div>
                <div className="text-muted-foreground">Safety Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                <div className="text-muted-foreground">Active Travelers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">23</div>
                <div className="text-muted-foreground">Scam Alerts Today</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Enhanced Safety Dashboard</h2>
          
          {/* NEW: Enhanced Dashboard with Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="live-map">Live Map</TabsTrigger> {/* NEW: Add live map tab */}
              <TabsTrigger value="scam-alerts">Scam Alerts</TabsTrigger>
              <TabsTrigger value="reviews">Reviews & Rewards</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
              <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardItems.map((item) => {
                  const Icon = item.icon;
                  
                  // NEW: Handle dashboard item clicks with notifications
                  const handleItemClick = (href: string, title: string) => {
                    toast.success(`🚀 Opening ${title}...`);
                    // Navigation will be handled by the Link component
                  };

                  return (
                    <Link key={item.title} href={item.href} onClick={() => handleItemClick(item.href, item.title)}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className={`${item.color} text-white p-3 rounded-lg`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            {item.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Important
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {item.description}
                          </CardDescription>
                          <Button className="w-full mt-4" variant="outline">
                            Open {item.title}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </TabsContent>

            {/* NEW: Live Map Tab with real map component */}
            <TabsContent value="live-map">
              <MapComponent />
            </TabsContent>

            {/* NEW: Scam Alerts Tab */}
            <TabsContent value="scam-alerts">
              <ScamDetailsUpdate />
            </TabsContent>

            {/* NEW: Reviews & Rewards Tab */}
            <TabsContent value="reviews">
              <ReviewIncentives />
            </TabsContent>

            {/* NEW: Emergency Contact Tab */}
            <TabsContent value="emergency">
              <AuthorityMessenger />
            </TabsContent>

            {/* NEW: Lost & Found Tab */}
            <TabsContent value="lost-found">
              <LostAndFound />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Emergency Contact Banner */}
      <section className="bg-destructive/5 border-t border-destructive/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4 text-destructive">
            🚨 Need Immediate Help?
          </h3>
          <p className="text-muted-foreground mb-6">
            Use the emergency button for instant alerts to police, medical services, and your emergency contacts
          </p>
          

<Link to="/authority-messenger">
  <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
    View Emergency Panel
  </Button>
</Link>

        </div>
      </section>

      <PanicButton />
    </div>
  );
};

export default Dashboard;