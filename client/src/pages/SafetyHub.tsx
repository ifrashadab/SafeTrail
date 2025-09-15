import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PanicButton } from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Phone,
  MapPin,
  AlertTriangle,
  Clock,
  Thermometer,
  Cloud,
  Car,
  Mountain,
  Heart,
  Activity,
  User,
  CheckCircle,
} from "lucide-react";

interface User {
  id: string;
  touristId: string;
  fullName: string;
  profileCompleted: boolean;
}

const emergencyServices = [
  {
    state: "Assam",
    city: "Guwahati",
    services: [
      { name: "Police Emergency", number: "100", cost: "₹0" },
      { name: "Medical Emergency", number: "108", cost: "₹0" },
      { name: "Tourist Helpline", number: "+91-361-2547102", cost: "₹0" },
      { name: "Fire Services", number: "101", cost: "₹0" },
      { name: "Emergency Guide Service", number: "+91-98640-12345", cost: "₹1,500/day" },
    ]
  },
  {
    state: "Meghalaya",
    city: "Shillong",
    services: [
      { name: "Police Emergency", number: "100", cost: "₹0" },
      { name: "Medical Emergency", number: "108", cost: "₹0" },
      { name: "Tourist Helpline", number: "+91-364-2226420", cost: "₹0" },
      { name: "Mountain Rescue", number: "+91-98630-78901", cost: "₹2,000/rescue" },
      { name: "Weather Emergency", number: "+91-364-2505014", cost: "₹0" },
    ]
  },
  {
    state: "Arunachal Pradesh",
    city: "Tawang",
    services: [
      { name: "Border Security Force", number: "112", cost: "₹0" },
      { name: "Medical Emergency", number: "108", cost: "₹0" },
      { name: "High Altitude Rescue", number: "+91-98690-56789", cost: "₹3,000/rescue" },
      { name: "Monastery Emergency", number: "+91-98620-11223", cost: "₹0" },
    ]
  }
];

const safetyAlerts = [
  {
    location: "Kaziranga National Park",
    level: "Medium",
    message: "Heavy monsoon rains may affect safari schedules. Entry fee: ₹175 for Indians.",
    time: "2 hours ago",
    color: "orange"
  },
  {
    location: "Tawang Monastery",
    level: "High",
    message: "High altitude sickness reported. Carry oxygen masks (₹150/day rental).",
    time: "4 hours ago",
    color: "red"
  },
  {
    location: "Shillong Peak",
    level: "Low",
    message: "Clear weather conditions. Perfect for sightseeing. Cable car: ₹50/person.",
    time: "6 hours ago",
    color: "green"
  },
  {
    location: "Dawki River",
    level: "Medium",
    message: "Water levels rising due to rain. Boating suspended. Usual cost: ₹300/boat.",
    time: "8 hours ago",
    color: "orange"
  }
];

const safetyTips = [
  {
    category: "Weather Safety",
    tips: [
      "North East weather changes rapidly - carry umbrella and warm clothes",
      "Monsoon season (June-September) brings heavy rainfall and landslides",
      "Winter temperatures in Tawang can drop to -10°C, pack accordingly"
    ]
  },
  {
    category: "Cultural Sensitivity",
    tips: [
      "Respect local customs and tribal traditions in all Seven Sisters states",
      "Photography restrictions at monasteries and tribal areas - ask permission",
      "Dress modestly when visiting religious sites like Kamakhya Temple"
    ]
  },
  {
    category: "Travel Documentation",
    tips: [
      "Inner Line Permit (ILP) required for Arunachal Pradesh, Mizoram, Nagaland",
      "Carry valid ID proof for all North Eastern state entries",
      "Keep emergency contacts list in local languages if possible"
    ]
  },
  {
    category: "Health & Medical",
    tips: [
      "Malaria and dengue precautions needed in lowland areas",
      "High altitude medication recommended for Tawang (10,000+ feet)",
      "Safe drinking water - bottled water costs ₹20-40 in remote areas"
    ]
  }
];

const SafetyHub = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentLocation, setCurrentLocation] = useState("Guwahati, Assam");
  const [safetyScore, setSafetyScore] = useState(87);
  const [weatherTemp, setWeatherTemp] = useState(28);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} showBackButton />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 text-white p-4 rounded-full mr-4">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Travel Safety Hub</h1>
              <p className="text-muted-foreground">AI-powered safety insights for North East states</p>
            </div>
          </div>
        </div>

        {/* Safety Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                  <p className="font-semibold" data-testid="text-current-location">{currentLocation}</p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safety Score</p>
                  <p className="text-2xl font-bold text-green-600" data-testid="text-safety-score">{safetyScore}%</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={safetyScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weather</p>
                  <p className="font-semibold" data-testid="text-weather">{weatherTemp}°C • Partly Cloudy</p>
                </div>
                <Cloud className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Status</p>
                  <p className="font-semibold text-green-600" data-testid="text-emergency-status">All Clear</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-time Safety Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Real-time Safety Alerts
                </CardTitle>
                <CardDescription>
                  Current safety updates for popular North East destinations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {safetyAlerts.map((alert, index) => (
                  <Alert key={index} className={`border-l-4 ${
                    alert.color === 'red' ? 'border-l-red-500' :
                    alert.color === 'orange' ? 'border-l-orange-500' : 'border-l-green-500'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{alert.location}</p>
                          <p className="text-sm mt-1">{alert.message}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={alert.color === 'green' ? 'secondary' : alert.color === 'red' ? 'destructive' : 'default'}>
                            {alert.level}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Services Directory
                </CardTitle>
                <CardDescription>
                  Contact information for emergency services across North Eastern states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyServices.map((location, index) => (
                    <div key={index} className="border border-border p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {location.city}, {location.state}
                      </h4>
                      <div className="space-y-2">
                        {location.services.map((service, serviceIndex) => (
                          <div key={serviceIndex} className="flex justify-between items-center text-sm">
                            <span>{service.name}</span>
                            <div className="flex items-center gap-2">
                              <a 
                                href={`tel:${service.number}`}
                                data-testid={`link-call-${serviceIndex}`}
                                className="text-primary hover:underline font-medium"
                              >
                                {service.number}
                              </a>
                              <Badge variant="outline" className="text-xs">
                                {service.cost}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Tips and Guidelines */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  North East Travel Safety Tips
                </CardTitle>
                <CardDescription>
                  Essential safety guidelines for exploring the Seven Sisters states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {safetyTips.map((category, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        {category.category}
                      </h4>
                      <ul className="space-y-2">
                        {category.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Safety Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-share-location"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Share Current Location
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-weather-alert"
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Subscribe to Weather Alerts
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-emergency-contacts"
                >
                  <User className="h-4 w-4 mr-2" />
                  Update Emergency Contacts
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-offline-maps"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Download Offline Maps (₹99)
                </Button>
              </CardContent>
            </Card>

            {/* Cost Information */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Service Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Emergency Ambulance</span>
                  <Badge variant="secondary">₹500-1,000</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Tourist Guide (Emergency)</span>
                  <Badge variant="secondary">₹1,500/day</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Helicopter Rescue (Mountain)</span>
                  <Badge variant="secondary">₹50,000-₹1,00,000</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Satellite Phone Rental</span>
                  <Badge variant="secondary">₹500/day</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PanicButton />
    </div>
  );
};

export default SafetyHub;