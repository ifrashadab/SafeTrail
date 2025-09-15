import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Shield,
  Trees,
  AlertTriangle,
  Send,
  CheckCircle
} from "lucide-react";

interface Authority {
  id: string;
  name: string;
  type: 'police' | 'forest' | 'tourism' | 'medical';
  phone: string;
  location: string;
  responseTime: string;
  available: boolean;
}

interface Message {
  id: string;
  to: string[];
  subject: string;
  content: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'responded';
}

const authorities: Authority[] = [
  {
    id: "1",
    name: "Kaziranga Forest Guard Station",
    type: "forest",
    phone: "+91-376-262-423",
    location: "Kaziranga National Park",
    responseTime: "15-30 mins",
    available: true
  },
  {
    id: "2", 
    name: "Guwahati Police Control Room",
    type: "police",
    phone: "100",
    location: "Guwahati City",
    responseTime: "10-20 mins", 
    available: true
  },
  {
    id: "3",
    name: "Tawang Police Station",
    type: "police", 
    phone: "+91-379-422-2233",
    location: "Tawang, Arunachal Pradesh",
    responseTime: "20-45 mins",
    available: true
  },
  {
    id: "4",
    name: "Shillong Tourism Helpdesk",
    type: "tourism",
    phone: "+91-364-222-6420", 
    location: "Shillong, Meghalaya",
    responseTime: "30-60 mins",
    available: true
  },
  {
    id: "5",
    name: "Manas Forest Department",
    type: "forest",
    phone: "+91-366-266-2637",
    location: "Manas National Park",
    responseTime: "20-40 mins",
    available: false
  }
];

export function AuthorityMessenger() {
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);
  const [message, setMessage] = useState({
    subject: "",
    content: "",
    location: "",
    priority: "medium" as const
  });
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [currentLocation, setCurrentLocation] = useState("Kaziranga National Park Area");

  const handleAuthorityToggle = (authorityId: string) => {
    setSelectedAuthorities(prev => 
      prev.includes(authorityId)
        ? prev.filter(id => id !== authorityId)
        : [...prev, authorityId]
    );
  };

  const handleQuickSelect = (type: 'emergency' | 'forest' | 'police' | 'all') => {
    switch (type) {
      case 'emergency':
        setSelectedAuthorities(authorities.filter(a => a.available && (a.type === 'police' || a.type === 'medical')).map(a => a.id));
        setMessage(prev => ({ ...prev, priority: 'emergency' }));
        break;
      case 'forest':
        setSelectedAuthorities(authorities.filter(a => a.available && a.type === 'forest').map(a => a.id));
        break;
      case 'police':
        setSelectedAuthorities(authorities.filter(a => a.available && a.type === 'police').map(a => a.id));
        break;
      case 'all':
        setSelectedAuthorities(authorities.filter(a => a.available).map(a => a.id));
        break;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAuthorities.length === 0) {
      toast.error("Please select at least one authority to contact"); // NEW: Use toast instead of alert
      return;
    }
    
    if (!message.subject || !message.content) {
      toast.error("Please fill in subject and message content"); // NEW: Use toast instead of alert
      return;
    }

    const selectedAuthorityNames = authorities
      .filter(a => selectedAuthorities.includes(a.id))
      .map(a => a.name);

    const newMessage: Message = {
      id: Date.now().toString(),
      to: selectedAuthorityNames,
      ...message,
      location: message.location || currentLocation,
      timestamp: new Date().toLocaleString(),
      status: 'sent'
    };

    setSentMessages(prev => [newMessage, ...prev]);
    
    // NEW: Show confirmation with toast
    toast.success(`📨 Message sent to ${selectedAuthorityNames.length} authorities. Expected response: 10-45 minutes`);
    
    // Reset form
    setMessage({ subject: "", content: "", location: "", priority: "medium" });
    setSelectedAuthorities([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAuthorityIcon = (type: string) => {
    switch (type) {
      case 'police': return <Shield className="h-4 w-4" />;
      case 'forest': return <Trees className="h-4 w-4" />;
      case 'tourism': return <MapPin className="h-4 w-4" />;
      case 'medical': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Emergency Quick Actions
          </CardTitle>
          <CardDescription className="text-red-700">
            For immediate assistance, use these quick contact options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              onClick={() => handleQuickSelect('emergency')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              🚨 Emergency
            </Button>
            <Button 
              onClick={() => handleQuickSelect('police')}
              variant="outline"
              className="border-blue-300 text-blue-700"
            >
              👮 Police Only
            </Button>
            <Button 
              onClick={() => handleQuickSelect('forest')}
              variant="outline"
              className="border-green-300 text-green-700"
            >
              🌲 Forest Guards
            </Button>
            <Button 
              onClick={() => handleQuickSelect('all')}
              variant="outline"
            >
              📢 All Available
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authority Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Select Authorities to Contact
          </CardTitle>
          <CardDescription>
            Choose which local authorities to send your message to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {authorities.map((authority) => (
              <div 
                key={authority.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAuthorities.includes(authority.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-accent/50'
                } ${!authority.available ? 'opacity-50' : ''}`}
                onClick={() => authority.available && handleAuthorityToggle(authority.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    authority.type === 'police' ? 'bg-blue-100 text-blue-600' :
                    authority.type === 'forest' ? 'bg-green-100 text-green-600' :
                    authority.type === 'tourism' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getAuthorityIcon(authority.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{authority.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {authority.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {authority.responseTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {authority.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {authority.available ? (
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Offline</Badge>
                  )}
                  {selectedAuthorities.includes(authority.id) && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Form */}
      <Card>
        <CardHeader>
          <CardTitle>Compose Message</CardTitle>
          <CardDescription>
            Send a message to selected authorities ({selectedAuthorities.length} selected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Subject *</label>
                <Input
                  placeholder="e.g., Tourist assistance needed"
                  value={message.subject}
                  onChange={(e) => setMessage(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority Level *</label>
                <div className="flex gap-2 mt-2">
                  {(['low', 'medium', 'high', 'emergency'] as const).map((priority) => (
                    <Button
                      key={priority}
                      type="button"
                      variant={message.priority === priority ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMessage(prev => ({ ...prev, priority }))}
                      className={message.priority === priority ? getPriorityColor(priority) : ''}
                    >
                      {priority === 'emergency' ? '🚨' : priority === 'high' ? '⚠️' : priority === 'medium' ? '📋' : '📝'} {priority.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Your Location</label>
              <Input
                placeholder="Current location (auto-detected or manual entry)"
                value={message.location}
                onChange={(e) => setMessage(prev => ({ ...prev, location: e.target.value }))}
              />
              <div className="text-xs text-muted-foreground mt-1">
                📍 Current: {currentLocation}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                placeholder="Describe your situation, what assistance you need, and any relevant details..."
                value={message.content}
                onChange={(e) => setMessage(prev => ({ ...prev, content: e.target.value }))}
                required
                className="min-h-[100px]"
              />
            </div>

            {selectedAuthorities.length > 0 && (
              <Alert>
                <MessageCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Message will be sent to:</strong>
                  <ul className="mt-2 space-y-1">
                    {authorities
                      .filter(a => selectedAuthorities.includes(a.id))
                      .map(authority => (
                        <li key={authority.id} className="text-sm">
                          • {authority.name} ({authority.phone})
                        </li>
                      ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={selectedAuthorities.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message to Authorities
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Message History */}
      {sentMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Message History</CardTitle>
            <CardDescription>
              Your recent messages to local authorities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sentMessages.map((msg) => (
              <div key={msg.id} className="border border-border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{msg.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      To: {msg.to.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(msg.priority)}>
                      {msg.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {msg.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm mb-2">{msg.content}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>📍 {msg.location}</span>
                  <span>🕐 {msg.timestamp}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}