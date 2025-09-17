import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Brain,
  Activity,
  MapPin,
  Clock,
  TrendingUp,
  Zap,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Users,
  BarChart3,
  Timer,
  Navigation,
  Wifi,
  WifiOff,
  Bell,
  BellRing,
  Shield,
  Map,
  Phone,
  MessageSquare
} from 'lucide-react';

interface AnomalyAlert {
  id: string;
  touristId: string;
  touristName: string;
  type: 'location_drop' | 'inactivity' | 'route_deviation' | 'speed_anomaly' | 'geo_fence_breach' | 'panic_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
  };
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  confidence: number; // AI confidence score 0-100
  actionsTaken?: string[];
  assignedOfficer?: string;
}

interface TouristStats {
  totalTourists: number;
  activeAlerts: number;
  resolvedToday: number;
  averageResponseTime: number; 
  systemAccuracy: number; 
}

const AnomalyDetectionPage = () => {
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [stats, setStats] = useState<TouristStats>({
    totalTourists: 1247,
    activeAlerts: 0,
    resolvedToday: 18,
    averageResponseTime: 4.2,
    systemAccuracy: 98.5
  });
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Simulate real-time anomaly detection data
    const mockAnomalies: AnomalyAlert[] = [
      {
        id: 'ANO-001',
        touristId: 'T2024-045',
        touristName: 'Raj Kumar',
        type: 'route_deviation',
        severity: 'high',
        message: 'Tourist deviated 3.2km from planned route in restricted area near Indo-China border',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        location: {
          lat: 27.6648,
          lng: 93.6503,
          address: 'Border Road, Tawang',
          state: 'Arunachal Pradesh'
        },
        status: 'active',
        confidence: 94,
        assignedOfficer: 'Officer M. Singh'
      },
      {
        id: 'ANO-002',
        touristId: 'T2024-089',
        touristName: 'Priya Sharma',
        type: 'inactivity',
        severity: 'medium',
        message: 'No movement detected for 72 minutes at remote trekking location',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        location: {
          lat: 25.5788,
          lng: 91.8933,
          address: 'Cherrapunji Falls Trek',
          state: 'Meghalaya'
        },
        status: 'investigating',
        confidence: 87,
        actionsTaken: ['SMS sent to tourist', 'Emergency contact notified'],
        assignedOfficer: 'Officer K. Das'
      },
      {
        id: 'ANO-003',
        touristId: 'T2024-123',
        touristName: 'David Wilson',
        type: 'speed_anomaly',
        severity: 'critical',
        message: 'Unusual high-speed movement detected - possible vehicle accident or emergency',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        location: {
          lat: 26.1445,
          lng: 91.7362,
          address: 'NH-37, Kaziranga',
          state: 'Assam'
        },
        status: 'active',
        confidence: 96,
        actionsTaken: ['Emergency services dispatched', 'Police alerted'],
        assignedOfficer: 'Officer R. Bora'
      },
      {
        id: 'ANO-004',
        touristId: 'T2024-067',
        touristName: 'Sarah Johnson',
        type: 'geo_fence_breach',
        severity: 'medium',
        message: 'Tourist entered restricted wildlife sanctuary area without proper permits',
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        location: {
          lat: 26.7271,
          lng: 93.3619,
          address: 'Kaziranga Core Area',
          state: 'Assam'
        },
        status: 'resolved',
        confidence: 91,
        actionsTaken: ['Tourist contacted', 'Guide dispatched', 'Safely escorted out'],
        assignedOfficer: 'Officer P. Gogoi'
      },
      {
        id: 'ANO-005',
        touristId: 'T2024-201',
        touristName: 'Ahmed Ali',
        type: 'panic_pattern',
        severity: 'high',
        message: 'Erratic movement pattern detected - possible distress or panic situation',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        location: {
          lat: 24.6637,
          lng: 93.9063,
          address: 'Loktak Lake Area',
          state: 'Manipur'
        },
        status: 'investigating',
        confidence: 89,
        actionsTaken: ['Local guide contacted', 'Tourist called - no response'],
        assignedOfficer: 'Officer L. Singh'
      }
    ];

    setAnomalies(mockAnomalies);
    setStats(prev => ({ ...prev, activeAlerts: mockAnomalies.filter(a => a.status === 'active').length }));
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'investigating': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      case 'false_positive': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'location_drop': return <WifiOff className="w-5 h-5" />;
      case 'inactivity': return <Clock className="w-5 h-5" />;
      case 'route_deviation': return <Navigation className="w-5 h-5" />;
      case 'speed_anomaly': return <Zap className="w-5 h-5" />;
      case 'geo_fence_breach': return <Shield className="w-5 h-5" />;
      case 'panic_pattern': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getAnomalyTypeLabel = (type: string) => {
    switch (type) {
      case 'location_drop': return 'Location Drop-off';
      case 'inactivity': return 'Prolonged Inactivity';
      case 'route_deviation': return 'Route Deviation';
      case 'speed_anomaly': return 'Speed Anomaly';
      case 'geo_fence_breach': return 'Geo-fence Breach';
      case 'panic_pattern': return 'Panic Pattern';
      default: return 'Unknown Anomaly';
    }
  };

  const filteredAnomalies = selectedSeverity === 'all' 
    ? anomalies 
    : anomalies.filter(a => a.severity === selectedSeverity);

  const handleResolveAnomaly = (id: string) => {
    setAnomalies(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'resolved', actionsTaken: [...(a.actionsTaken || []), 'Manually resolved by operator'] } : a
    ));
  };

  const handleMarkFalsePositive = (id: string) => {
    setAnomalies(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'false_positive' } : a
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              AI Anomaly Detection System
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring and intelligent detection of unusual tourist behavior patterns across Northeast India
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={notifications ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? <BellRing className="w-4 h-4 mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
              Notifications {notifications ? 'On' : 'Off'}
            </Button>
            <Badge variant={isMonitoring ? "default" : "secondary"} className="flex items-center gap-1 px-3 py-1">
              {isMonitoring ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? 'Pause' : 'Resume'} System
            </Button>
          </div>
        </div>

        {/* System Status Alert */}
        {!isMonitoring && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>System Monitoring Paused</AlertTitle>
            <AlertDescription>
              Anomaly detection is currently paused. Tourist safety monitoring is not active. Click "Resume System" to continue monitoring.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <div className="text-2xl font-bold text-blue-600">{stats.totalTourists}</div>
              </div>
              <div className="text-sm text-muted-foreground">Total Tourists Tracked</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
              </div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
              </div>
              <div className="text-sm text-muted-foreground">Resolved Today</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Timer className="w-5 h-5 text-purple-600 mr-2" />
                <div className="text-2xl font-bold text-purple-600">{stats.averageResponseTime}m</div>
              </div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                <div className="text-2xl font-bold text-green-600">{stats.systemAccuracy}%</div>
              </div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Detection Settings</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
          </TabsList>

          {/* Active Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Real-time Alert Monitoring</h3>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedSeverity} 
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAnomalies.map((anomaly) => (
                <Card key={anomaly.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(anomaly.severity)}`}>
                          {getAnomalyIcon(anomaly.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className="text-lg">{getAnomalyTypeLabel(anomaly.type)}</CardTitle>
                            <Badge variant="outline" className={`capitalize ${getSeverityColor(anomaly.severity)}`}>
                              {anomaly.severity}
                            </Badge>
                            <Badge className={`text-white ${getStatusColor(anomaly.status)}`}>
                              {anomaly.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tourist: {anomaly.touristName} (ID: {anomaly.touristId}) • 
                            Confidence: {anomaly.confidence}% • 
                            {anomaly.assignedOfficer && ` Assigned to: ${anomaly.assignedOfficer}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        <div>{anomaly.timestamp.toLocaleDateString()}</div>
                        <div>{anomaly.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <p className="text-base">{anomaly.message}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{anomaly.location.address}, {anomaly.location.state}</span>
                      </div>

                      {anomaly.actionsTaken && anomaly.actionsTaken.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Actions Taken:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {anomaly.actionsTaken.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                        <Button size="sm" variant="outline">
                          <Map className="w-4 h-4 mr-2" />
                          View on Map
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Tourist
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Alert
                        </Button>
                        
                        {anomaly.status === 'active' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleResolveAnomaly(anomaly.id)}
                              className="ml-auto"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Resolved
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMarkFalsePositive(anomaly.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              False Positive
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Anomaly Types Distribution</CardTitle>
                  <CardDescription>Breakdown of detected anomaly types this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Route Deviation</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '35%'}}></div>
                        </div>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Inactivity</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '28%'}}></div>
                        </div>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Speed Anomaly</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '20%'}}></div>
                        </div>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Geo-fence Breach</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '12%'}}></div>
                        </div>
                        <span className="text-sm font-medium">12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Location Drop-off</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '5%'}}></div>
                        </div>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>State-wise Alert Distribution</CardTitle>
                  <CardDescription>Anomaly detection by Northeast states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Arunachal Pradesh</span>
                      <span className="text-sm font-medium">42 alerts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Assam</span>
                      <span className="text-sm font-medium">38 alerts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Meghalaya</span>
                      <span className="text-sm font-medium">29 alerts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Manipur</span>
                      <span className="text-sm font-medium">23 alerts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mizoram</span>
                      <span className="text-sm font-medium">18 alerts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nagaland</span>
                      <span className="text-sm font-medium">15 alerts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tripura</span>
                      <span className="text-sm font-medium">12 alerts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Detection Sensitivity Settings
                  </CardTitle>
                  <CardDescription>
                    Configure AI detection parameters for different anomaly types
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Inactivity Detection</h4>
                      <div className="space-y-2">
                        <label className="text-sm">Alert threshold (minutes)</label>
                        <input type="number" defaultValue="45" className="w-full px-3 py-2 border rounded-md" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Route Deviation</h4>
                      <div className="space-y-2">
                        <label className="text-sm">Max deviation distance (km)</label>
                        <input type="number" defaultValue="2" className="w-full px-3 py-2 border rounded-md" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Speed Anomaly</h4>
                      <div className="space-y-2">
                        <label className="text-sm">Speed threshold (km/h)</label>
                        <input type="number" defaultValue="120" className="w-full px-3 py-2 border rounded-md" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Location Drop-off</h4>
                      <div className="space-y-2">
                        <label className="text-sm">Signal loss threshold (minutes)</label>
                        <input type="number" defaultValue="10" className="w-full px-3 py-2 border rounded-md" />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

     
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Alert Resolution History</CardTitle>
                <CardDescription>
                  Historical data of resolved and closed alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Historical alert data will be displayed here</p>
                  <p className="text-sm">Including resolution times, outcomes, and trends</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnomalyDetectionPage;
