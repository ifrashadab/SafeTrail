import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PanicButton } from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import {
  AlertTriangle,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Shield,
  Flag,
  Users,
  Phone,
  Car,
  Utensils,
  Bed,
  Camera,
} from "lucide-react";

interface User {
  id: string;
  touristId: string;
  fullName: string;
  profileCompleted: boolean;
}

const scamAlerts = [
  {
    location: "Guwahati Railway Station",
    type: "Fake Taxi Scam",
    description: "Unlicensed taxis overcharging tourists. Official taxi: ₹300-500 to city center.",
    reported: "8 reports today",
    severity: "High",
    time: "2 hours ago"
  },
  {
    location: "Shillong Police Bazar",
    type: "Overpriced Souvenirs",
    description: "Local handicrafts sold at 300% markup. Fair price: ₹200-800 for authentic items.",
    reported: "5 reports today",
    severity: "Medium",
    time: "4 hours ago"
  },
  {
    location: "Kaziranga National Park",
    type: "Fake Guide Services",
    description: "Unauthorized guides claiming forest department certification. Official guides: ₹500/day.",
    reported: "3 reports today",
    severity: "High",
    time: "6 hours ago"
  },
  {
    location: "Tawang Monastery Area",
    type: "Accommodation Fraud",
    description: "Fake online bookings for non-existent homestays. Verify through official tourism board.",
    reported: "2 reports today",
    severity: "Medium",
    time: "12 hours ago"
  }
];

const verifiedPricing = [
  {
    category: "Accommodation",
    items: [
      { name: "Budget Hotel (Guwahati)", fair: "₹800-1,200", inflated: "₹2,000+", savings: "40%" },
      { name: "Homestay (Shillong)", fair: "₹1,000-1,500", inflated: "₹3,000+", savings: "50%" },
      { name: "Monastery Stay (Tawang)", fair: "₹500-800", inflated: "₹1,500+", savings: "60%" },
      { name: "Eco Resort (Kaziranga)", fair: "₹2,500-4,000", inflated: "₹8,000+", savings: "50%" }
    ]
  },
  {
    category: "Transportation",
    items: [
      { name: "Airport to City (Guwahati)", fair: "₹300-500", inflated: "₹1,000+", savings: "50%" },
      { name: "Shared Taxi (Shillong-Cherrapunji)", fair: "₹150-200", inflated: "₹500+", savings: "60%" },
      { name: "Motorbike Rental (Daily)", fair: "₹400-600", inflated: "₹1,200+", savings: "50%" },
      { name: "SUV Hire (Tawang Circuit)", fair: "₹3,500-5,000", inflated: "₹10,000+", savings: "50%" }
    ]
  },
  {
    category: "Food & Dining",
    items: [
      { name: "Local Thali (Restaurant)", fair: "₹80-150", inflated: "₹300+", savings: "50%" },
      { name: "Momos (Street Food)", fair: "₹30-50", inflated: "₹100+", savings: "50%" },
      { name: "Fish Curry (Local Restaurant)", fair: "₹120-200", inflated: "₹400+", savings: "40%" },
      { name: "Assam Tea Experience", fair: "₹200-300", inflated: "₹800+", savings: "60%" }
    ]
  },
  {
    category: "Activities & Attractions",
    items: [
      { name: "Kaziranga Safari (Elephant)", fair: "₹175", inflated: "₹500+", savings: "65%" },
      { name: "Shillong Peak Cable Car", fair: "₹50", inflated: "₹150+", savings: "67%" },
      { name: "Dawki River Boating", fair: "₹300", inflated: "₹800+", savings: "63%" },
      { name: "Tawang Monastery Guide", fair: "₹500", inflated: "₹1,500+", savings: "67%" }
    ]
  }
];

const commonScams = [
  {
    title: "Gemstone Investment Scam",
    description: "Fake gem dealers in Guwahati markets claiming stones are 'investment grade' with guaranteed returns.",
    prevention: "Buy only from certified dealers. Government rates: ₹2,000-10,000 per carat for genuine stones.",
    location: "Guwahati, Dimapur markets"
  },
  {
    title: "Monastery Donation Pressure",
    description: "Fake monks pressuring tourists for large donations at religious sites.",
    prevention: "Voluntary donations only. Typical amount: ₹50-100 per visit to monastery donation box.",
    location: "Tawang, Bomdila monasteries"
  },
  {
    title: "Permit Processing Fee Fraud",
    description: "Fake agents charging inflated fees for Inner Line Permits and restricted area permits.",
    prevention: "Get permits through official channels only. ILP costs: ₹10-50 depending on state.",
    location: "State borders, tourism offices"
  },
  {
    title: "Photography Fee Scam",
    description: "Unauthorized persons demanding payment for photography at public places.",
    prevention: "Photography is free at most public places. Monument entry fees include photography rights.",
    location: "Tourist attractions across Seven Sisters"
  }
];

const ScamAwareness = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reportData, setReportData] = useState({
    location: "",
    scamType: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NEW: Use toast notification instead of alert
    toast.success(`🚨 Scam report submitted for ${reportData.location}! Report ID: NE${Date.now()}. Tourism authorities notified.`);
    setReportData({ location: "", scamType: "", description: "", amount: "" });
  };

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
            <div className="bg-orange-600 text-white p-4 rounded-full mr-4">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Scam Awareness Center</h1>
              <p className="text-muted-foreground">Local scam alerts and verified pricing for North East India</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2" data-testid="text-scam-reports">127</div>
              <div className="text-muted-foreground">Scam Reports Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-money-saved">₹2.4L</div>
              <div className="text-muted-foreground">Money Saved by Travelers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="text-verified-vendors">834</div>
              <div className="text-muted-foreground">Verified Vendors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2" data-testid="text-safety-score">94%</div>
              <div className="text-muted-foreground">Tourist Safety Score</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Current Alerts</TabsTrigger>
            <TabsTrigger value="pricing">Verified Pricing</TabsTrigger>
            <TabsTrigger value="scams">Common Scams</TabsTrigger>
            <TabsTrigger value="report">Report Scam</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Live Scam Alerts - North East India
                  </CardTitle>
                  <CardDescription>
                    Real-time reports from travelers across Seven Sisters states
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scamAlerts.map((alert, index) => (
                    <Alert key={index} className="border-l-4 border-l-orange-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{alert.location}</span>
                            <Badge variant={alert.severity === 'High' ? 'destructive' : 'default'}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                        <h4 className="font-medium text-orange-600 mb-1">{alert.type}</h4>
                        <p className="text-sm mb-2">{alert.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{alert.reported}</span>
                          <Button size="sm" variant="outline" data-testid={`button-view-details-${index}`}>
                            View Details
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="space-y-6">
              {verifiedPricing.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.category === 'Accommodation' && <Bed className="h-5 w-5" />}
                      {category.category === 'Transportation' && <Car className="h-5 w-5" />}
                      {category.category === 'Food & Dining' && <Utensils className="h-5 w-5" />}
                      {category.category === 'Activities & Attractions' && <Camera className="h-5 w-5" />}
                      {category.category} - Verified Pricing (₹)
                    </CardTitle>
                    <CardDescription>
                      Fair market rates vs inflated tourist prices in North East India
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Fair Price</div>
                              <div className="font-semibold text-green-600" data-testid={`text-fair-price-${itemIndex}`}>
                                {item.fair}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Tourist Price</div>
                              <div className="font-semibold text-red-600 line-through" data-testid={`text-inflated-price-${itemIndex}`}>
                                {item.inflated}
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Save {item.savings}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scams">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commonScams.map((scam, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      {scam.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {scam.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">How it works:</h4>
                      <p className="text-sm text-muted-foreground">{scam.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">How to avoid:</h4>
                      <p className="text-sm">{scam.prevention}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Report a Scam
                </CardTitle>
                <CardDescription>
                  Help protect fellow travelers by reporting suspicious activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Location *</label>
                      <Input
                        data-testid="input-report-location"
                        placeholder="e.g., Guwahati Railway Station"
                        value={reportData.location}
                        onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Scam Type *</label>
                      <Input
                        data-testid="input-report-type"
                        placeholder="e.g., Overpriced taxi fare"
                        value={reportData.scamType}
                        onChange={(e) => setReportData(prev => ({ ...prev, scamType: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount Involved (₹)</label>
                    <Input
                      data-testid="input-report-amount"
                      placeholder="e.g., 1500"
                      value={reportData.amount}
                      onChange={(e) => setReportData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <Textarea
                      data-testid="textarea-report-description"
                      placeholder="Please describe what happened in detail..."
                      value={reportData.description}
                      onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-report">
                    Submit Scam Report
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Reporting Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Assam Tourism Helpline</h4>
                    <p className="text-sm text-muted-foreground">For scams in Guwahati, Kaziranga</p>
                    <a href="tel:+913612547102" className="text-primary hover:underline">
                      +91-361-2547102
                    </a>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Meghalaya Police Cyber Crime</h4>
                    <p className="text-sm text-muted-foreground">For online frauds, cyber scams</p>
                    <a href="tel:1930" className="text-primary hover:underline">
                      1930 (Toll Free)
                    </a>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Consumer Forum</h4>
                    <p className="text-sm text-muted-foreground">For overcharging complaints</p>
                    <a href="tel:18001801551" className="text-primary hover:underline">
                      1800-180-1551 (Toll Free)
                    </a>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">North East Tourist Board</h4>
                    <p className="text-sm text-muted-foreground">Official tourism complaints</p>
                    <a href="tel:+913612547104" className="text-primary hover:underline">
                      +91-361-2547104
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <PanicButton />
    </div>
  );
};

export default ScamAwareness;