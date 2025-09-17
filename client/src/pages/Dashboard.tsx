import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { PanicButton } from "@/components/PanicButton";
import { MapComponent } from "@/components/MapComponent";
import { ScamDetailsUpdate } from "@/components/ScamDetailsUpdate";
import { ReviewIncentives } from "@/components/ReviewIncentives";
import { AuthorityMessenger } from "@/components/AuthorityMessenger";
import { LostAndFound } from "@/components/LostAndFound";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
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
  MessageSquare,
  Phone,
  Activity,
  Globe,
  Brain,
  Zap,
  TrendingUp,
  Languages,
  Eye
} from "lucide-react";

interface User {
  id: string;
  touristId: string;
  fullName: string;
  profileCompleted: boolean;
}

interface AnomalyAlert {
  id: string;
  type: 'location_drop' | 'inactivity' | 'route_deviation' | 'speed_anomaly';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  location?: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ml', name: 'Manipuri', nativeName: 'মৈইতৈইলোন', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

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

  {
    title: "Anomaly Detection",
    description: "AI-powered monitoring for unusual travel patterns and safety alerts",
    icon: Brain,
    href: "/anomaly-detection",
    color: "bg-purple-600",
    urgent: false,
  },
];


const AnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {

    const mockAnomalies: AnomalyAlert[] = [
      {
        id: '1',
        type: 'location_drop',
        severity: 'medium',
        message: 'Tourist deviated 2km from planned route near Kaziranga National Park',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        location: 'Kaziranga, Assam'
      },
      {
        id: '2',
        type: 'inactivity',
        severity: 'low',
        message: 'No movement detected for 45 minutes at Tawang Monastery',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        location: 'Tawang, Arunachal Pradesh'
      },
      {
        id: '3',
        type: 'speed_anomaly',
        severity: 'high',
        message: 'Unusual speed pattern detected - possible emergency situation',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        location: 'Shillong, Meghalaya'
      }
    ];
    setAnomalies(mockAnomalies);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'location_drop': return <MapPin className="w-4 h-4" />;
      case 'inactivity': return <Clock className="w-4 h-4" />;
      case 'route_deviation': return <TrendingUp className="w-4 h-4" />;
      case 'speed_anomaly': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Anomaly Detection System
          </h3>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of unusual travel patterns and potential safety concerns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isMonitoring ? "default" : "secondary"} className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? 'Pause' : 'Resume'} Monitoring
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-muted-foreground">Active Monitoring</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-muted-foreground">Tourists Tracked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{anomalies.length}</div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">98.5%</div>
            <div className="text-sm text-muted-foreground">Detection Accuracy</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Anomaly Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div
                key={anomaly.id}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(anomaly.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAnomalyIcon(anomaly.type)}
                    <div>
                      <div className="font-medium">{anomaly.message}</div>
                      <div className="text-sm opacity-75 mt-1">
                        {anomaly.location} • {anomaly.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {anomaly.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// NEW: Multilingual Support Component
const MultilingualSupport = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translations, setTranslations] = useState({
    welcome: 'Welcome to Tourist Safety Platform',
    emergency: 'Emergency Services',
    help: 'Need Help?',
    location: 'Your Current Location',
    safety: 'Safety Status: Secure'
  });

  const translateText = (langCode: string) => {
    // Simulate translation API call
    const mockTranslations: Record<string, any> = {
      'hi': {
        welcome: 'पर्यटक सुरक्षा मंच में आपका स्वागत है',
        emergency: 'आपातकालीन सेवाएं',
        help: 'मदद चाहिए?',
        location: 'आपका वर्तमान स्थान',
        safety: 'सुरक्षा स्थिति: सुरक्षित'
      },
      'bn': {
        welcome: 'পর্যটক নিরাপত্তা প্ল্যাটফর্মে স্বাগতম',
        emergency: 'জরুরি সেবা',
        help: 'সাহায্য প্রয়োজন?',
        location: 'আপনার বর্তমান অবস্থান',
        safety: 'নিরাপত্তা অবস্থা: নিরাপদ'
      },
      'as': {
        welcome: 'পর্যটক সুৰক্ষা মঞ্চলৈ আদৰণি',
        emergency: 'জৰুৰীকালীন সেৱা',
        help: 'সহায়ৰ প্ৰয়োজন?',
        location: 'আপোনাৰ বৰ্তমানৰ অৱস্থান',
        safety: 'সুৰক্ষা স্থিতি: সুৰক্ষিত'
      }
    };

    if (mockTranslations[langCode]) {
      setTranslations(mockTranslations[langCode]);
      toast.success(`Language changed to ${languages.find(l => l.code === langCode)?.name}`);
    }
    setSelectedLanguage(langCode);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Languages className="w-6 h-6 text-blue-600" />
          Multilingual Support
        </h3>
        <p className="text-muted-foreground mt-1">
          Platform available in 10+ Indian languages and English for inclusive accessibility
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Language Selection</CardTitle>
          <CardDescription>
            Choose your preferred language for the platform interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                className="justify-start text-left h-auto p-3"
                onClick={() => translateText(lang.code)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium text-sm">{lang.name}</span>
                  </div>
                  <div className="text-xs opacity-75">{lang.nativeName}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Translation Preview</CardTitle>
          <CardDescription>
            See how the interface appears in the selected language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="text-xl font-semibold">{translations.welcome}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-background rounded border">
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <Phone className="w-4 h-4" />
                  {translations.emergency}
                </div>
              </div>
              <div className="p-3 bg-background rounded border">
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <MessageSquare className="w-4 h-4" />
                  {translations.help}
                </div>
              </div>
              <div className="p-3 bg-background rounded border">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <MapPin className="w-4 h-4" />
                  {translations.location}
                </div>
              </div>
              <div className="p-3 bg-background rounded border">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Shield className="w-4 h-4" />
                  {translations.safety}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice & Text Emergency Access</CardTitle>
          <CardDescription>
            Specialized features for elderly and disabled travelers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Voice Commands
              </h5>
              <p className="text-sm text-muted-foreground mb-3">
                Say "Help me" or "Emergency" in any supported language
              </p>
              <Button size="sm" className="w-full">
                Enable Voice Commands
              </Button>
            </div>
            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Text-to-Speech
              </h5>
              <p className="text-sm text-muted-foreground mb-3">
                Audio announcements for visually impaired users
              </p>
              <Button size="sm" className="w-full">
                Enable Audio Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = { 
      id: "1", 
      touristId: "T2024001", 
      fullName: "Tourist User", 
      profileCompleted: true 
    };
    setUser(userData);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      
      <section className="relative bg-gradient-to-br from-primary to-blue-800 text-primary-foreground py-16">
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
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
              <Languages className="w-4 h-4 mr-2" />
              10+ Languages
            </Badge>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
                <div className="text-muted-foreground">Anomalies Detected</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

   
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Enhanced Safety Dashboard</h2>
          
 
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="live-map">Live Map</TabsTrigger>
              <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
              <TabsTrigger value="multilingual">Languages</TabsTrigger>
              <TabsTrigger value="scam-alerts">Scam Alerts</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardItems.map((item) => {
                  const Icon = item.icon;
                  
                  const handleItemClick = (href: string, title: string) => {
                    toast.success(`🚀 Opening ${title}...`);
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

            <TabsContent value="live-map">
              <MapComponent />
            </TabsContent>

          
            <TabsContent value="anomaly">
              <AnomalyDetection />
            </TabsContent>

           
            <TabsContent value="multilingual">
              <MultilingualSupport />
            </TabsContent>

            <TabsContent value="scam-alerts">
              <ScamDetailsUpdate />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewIncentives />
            </TabsContent>

            <TabsContent value="emergency">
              <AuthorityMessenger />
            </TabsContent>

            <TabsContent value="lost-found">
              <LostAndFound />
            </TabsContent>
          </Tabs>
        </div>
      </section>

     
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
