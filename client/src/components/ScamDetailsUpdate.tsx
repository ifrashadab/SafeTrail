import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  Shield,
  Plus,
  Flag,
  CheckCircle
} from "lucide-react";

interface ScamAlert {
  id: string;
  title: string;
  location: string;
  description: string;
  reportedBy: string;
  userType: 'tourist' | 'admin';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  verified: boolean;
  upvotes: number;
}

// Sample scam alerts data
const initialAlerts: ScamAlert[] = [
  {
    id: "1",
    title: "Overpriced Safari Tickets",
    location: "Kaziranga National Park Gate",
    description: "Fake agents selling safari tickets at 3x the official price (₹1,500 vs ₹175). Always buy from official counter inside the park.",
    reportedBy: "Tourism Admin",
    userType: "admin",
    timestamp: "2 hours ago",
    severity: "high",
    verified: true,
    upvotes: 23
  },
  {
    id: "2", 
    title: "Taxi Meter Manipulation",
    location: "Guwahati Railway Station",
    description: "Some taxi drivers manipulate meters or refuse to use them. Insist on meter or agree on fare beforehand. Fair rate to city center: ₹300-400.",
    reportedBy: "Priya S.",
    userType: "tourist",
    timestamp: "5 hours ago", 
    severity: "medium",
    verified: false,
    upvotes: 15
  },
  {
    id: "3",
    title: "Fake Monastery Donations",
    location: "Tawang Monastery Area",
    description: "People in monk robes asking for large donations outside monastery. Real monks don't solicit money. Voluntary donations inside monastery only.",
    reportedBy: "Safety Team",
    userType: "admin",
    timestamp: "1 day ago",
    severity: "medium", 
    verified: true,
    upvotes: 31
  }
];

export function ScamDetailsUpdate() {
  const [alerts, setAlerts] = useState<ScamAlert[]>(initialAlerts);
  const [newAlert, setNewAlert] = useState({
    title: "",
    location: "",
    description: "",
    severity: "medium" as const
  });
  const [userType, setUserType] = useState<'tourist' | 'admin'>('tourist'); // This would come from user context

  const handleSubmitAlert = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAlert.title || !newAlert.location || !newAlert.description) {
      toast.error("Please fill in all required fields"); // NEW: Use toast instead of alert
      return;
    }

    const alert: ScamAlert = {
      id: Date.now().toString(),
      ...newAlert,
      reportedBy: userType === 'admin' ? 'Safety Admin' : 'Anonymous Tourist',
      userType,
      timestamp: 'Just now',
      verified: userType === 'admin',
      upvotes: 0
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ title: "", location: "", description: "", severity: "medium" });
    
    // NEW: Use toast notification instead of alert
    toast.success(`🚨 Scam Alert Submitted! Report for ${alert.location} is ${userType === 'admin' ? 'now live' : 'pending verification'}.`);
  };

  const handleUpvote = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, upvotes: alert.upvotes + 1 }
        : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Scam Details & Updates
        </CardTitle>
        <CardDescription>
          Community-driven scam alerts and safety updates for North East India
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Current Alerts</TabsTrigger>
            <TabsTrigger value="report">Report New Scam</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Active Scam Alerts ({alerts.length})</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Community Protected
              </Badge>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-orange-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-base">{alert.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{alert.location}</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {alert.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed">{alert.description}</p>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Reported by {alert.reportedBy}</span>
                          {alert.userType === 'admin' && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Official
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(alert.id)}
                          className="text-xs"
                        >
                          👍 Helpful ({alert.upvotes})
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Report New Scam Alert
                </CardTitle>
                <CardDescription>
                  Help protect fellow travelers by reporting scams and fraudulent activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAlert} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Alert Title *</label>
                    <Input
                      placeholder="e.g., Overpriced taxi fares at railway station"
                      value={newAlert.title}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Location *</label>
                    <Input
                      placeholder="e.g., Guwahati Railway Station, Gate 2"
                      value={newAlert.location}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Severity Level *</label>
                    <div className="flex gap-2 mt-2">
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant={newAlert.severity === level ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewAlert(prev => ({ ...prev, severity: level }))}
                          className={newAlert.severity === level ? getSeverityColor(level) : ''}
                        >
                          {level.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <Textarea
                      placeholder="Describe the scam in detail, including how to avoid it and fair prices if applicable..."
                      value={newAlert.description}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, description: e.target.value }))}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Scam Alert
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Reporting Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reporting Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Include specific location details and fair price information</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Describe prevention methods and warning signs</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Admin reports are verified immediately, tourist reports need verification</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>False reports may result in account restrictions</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}