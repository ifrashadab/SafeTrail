import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Plus, 
  MapPin, 
  Clock, 
  Phone, 
  Camera,
  Package,
  User,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";

interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  category: string;
  title: string;
  description: string;
  location: string;
  date: string;
  contactInfo: string;
  reportedBy: string;
  status: 'active' | 'resolved' | 'expired';
  photos: number;
  views: number;
  timestamp: string;
}

const sampleItems: LostFoundItem[] = [
  {
    id: "1",
    type: "lost",
    category: "Electronics",
    title: "Black iPhone 14 Pro",
    description: "Lost black iPhone 14 Pro with blue case. Has family photos and important documents. Last seen near Kaziranga visitor center.",
    location: "Kaziranga National Park Visitor Center",
    date: "Dec 10, 2024",
    contactInfo: "+91-98765-43210",
    reportedBy: "Priya Sharma",
    status: "active",
    photos: 1,
    views: 23,
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    type: "found",
    category: "Documents",
    title: "Tourist ID and Passport",
    description: "Found tourist ID (TID-2024-NE-987654321) and Indian passport belonging to Raj Kumar. Found near Tawang Monastery main gate.",
    location: "Tawang Monastery Main Gate",
    date: "Dec 9, 2024", 
    contactInfo: "+91-87654-32109",
    reportedBy: "Local Guide Service",
    status: "active",
    photos: 2,
    views: 45,
    timestamp: "1 day ago"
  },
  {
    id: "3",
    type: "lost",
    category: "Personal Items",
    title: "Blue Backpack with Camera",
    description: "Lost blue hiking backpack containing Canon DSLR camera, extra lenses, and travel documents. Very important for my photography work.",
    location: "Shillong Peak Viewpoint",
    date: "Dec 8, 2024",
    contactInfo: "+91-76543-21098", 
    reportedBy: "Michael Chen",
    status: "resolved",
    photos: 3,
    views: 67,
    timestamp: "2 days ago"
  },
  {
    id: "4",
    type: "found",
    category: "Accessories",
    title: "Silver Watch and Wallet",
    description: "Found silver wristwatch (Titan brand) and brown leather wallet with some cash and cards. Found at Dawki river boating area.",
    location: "Dawki River Boating Point",
    date: "Dec 7, 2024",
    contactInfo: "+91-65432-10987",
    reportedBy: "Boat Operator",
    status: "active", 
    photos: 2,
    views: 34,
    timestamp: "3 days ago"
  }
];

const categories = ["All", "Electronics", "Documents", "Personal Items", "Accessories", "Clothing", "Other"];

export function LostAndFound() {
  const [items, setItems] = useState<LostFoundItem[]>(sampleItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [newItem, setNewItem] = useState({
    type: 'lost' as const,
    category: 'Electronics',
    title: '',
    description: '',
    location: '',
    date: '',
    contactInfo: '',
    photos: 0
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

const handleSubmitItem = (e: React.FormEvent) => {
  e.preventDefault();

  if (!newItem.title || !newItem.description || !newItem.location || !newItem.contactInfo) {
    toast.error("Please fill in all required fields"); // show toast here
    return;
  }

  const item: LostFoundItem = {
    // spread all fields from newItem
    ...newItem,
    id: Date.now().toString(),
    reportedBy: "You",
    status: "active",
    views: 0,
    timestamp: "Just now",
    // you might need to add default values for missing LostFoundItem props
    type: newItem.type,
  };

  setItems(prev => [item, ...prev]);
  setNewItem({
    type: 'lost',
    category: 'Electronics',
    title: '',
    description: '',
    location: '',
    date: '',
    contactInfo: '',
    photos: 0
  });

  toast.success(
    `✅ ${newItem.type === 'lost' ? 'Lost' : 'Found'} item "${newItem.title}" reported successfully!`
  );
};


  const handleContactOwner = (item: LostFoundItem) => {
    // NEW: Use toast for contact information
    toast.success(`📞 Contact: ${item.reportedBy} at ${item.contactInfo}. ${item.type === 'lost' ? 'Call if you found this item' : 'Call to claim with ID'}.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Lost & Found Center
        </CardTitle>
        <CardDescription>
          Help fellow travelers recover lost items across North East India
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Items</TabsTrigger>
            <TabsTrigger value="report">Report Item</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search lost/found items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === 'lost' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('lost')}
                    className="text-red-600"
                  >
                    Lost
                  </Button>
                  <Button
                    variant={filterType === 'found' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('found')}
                    className="text-green-600"
                  >
                    Found
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{items.filter(i => i.type === 'lost' && i.status === 'active').length}</div>
                  <div className="text-sm text-muted-foreground">Lost Items</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{items.filter(i => i.type === 'found' && i.status === 'active').length}</div>
                  <div className="text-sm text-muted-foreground">Found Items</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{items.filter(i => i.status === 'resolved').length}</div>
                  <div className="text-sm text-muted-foreground">Reunited</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <h3 className="font-semibold">
                {filterType === 'all' ? 'All Items' : filterType === 'lost' ? 'Lost Items' : 'Found Items'} 
                ({filteredItems.length})
              </h3>
              
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(item.type)}>
                            {item.type === 'lost' ? '🔍 LOST' : '✅ FOUND'}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span><strong>Location:</strong> {item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span><strong>Date:</strong> {item.date}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-primary" />
                          <span><strong>Reported by:</strong> {item.reportedBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="h-4 w-4 text-primary" />
                          <span><strong>Views:</strong> {item.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {item.photos > 0 && (
                          <span className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            {item.photos} photo{item.photos > 1 ? 's' : ''}
                          </span>
                        )}
                        <span>{item.timestamp}</span>
                      </div>
                      <Button 
                        onClick={() => handleContactOwner(item)}
                        disabled={item.status !== 'active'}
                        size="sm"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact {item.type === 'lost' ? 'Owner' : 'Finder'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredItems.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No items found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters, or be the first to report an item.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Report Lost or Found Item
                </CardTitle>
                <CardDescription>
                  Help the community by reporting lost or found items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Item Status *</label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant={newItem.type === 'lost' ? 'default' : 'outline'}
                          onClick={() => setNewItem(prev => ({ ...prev, type: 'lost' }))}
                          className="flex-1"
                        >
                          🔍 I Lost Something
                        </Button>
                        <Button
                          type="button"
                          variant={newItem.type === 'found' ? 'default' : 'outline'}
                          onClick={() => setNewItem(prev => ({ ...prev, type: 'found' }))}
                          className="flex-1"
                        >
                          ✅ I Found Something
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories.slice(1).map((category) => (
                          <Button
                            key={category}
                            type="button"
                            variant={newItem.category === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewItem(prev => ({ ...prev, category }))}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Item Title *</label>
                    <Input
                      placeholder="e.g., Black iPhone 14 Pro, Blue Backpack with Camera"
                      value={newItem.title}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Detailed Description *</label>
                    <Textarea
                      placeholder="Provide detailed description including color, brand, distinctive features, contents, etc."
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Location *</label>
                      <Input
                        placeholder="e.g., Kaziranga Visitor Center, Tawang Monastery"
                        value={newItem.location}
                        onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date *</label>
                      <Input
                        type="date"
                        value={newItem.date}
                        onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Contact Information *</label>
                      <Input
                        placeholder="+91-XXXXX-XXXXX"
                        value={newItem.contactInfo}
                        onChange={(e) => setNewItem(prev => ({ ...prev, contactInfo: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Number of Photos</label>
                      <div className="flex gap-2 mt-2">
                        {[0, 1, 2, 3, 4, 5].map((count) => (
                          <Button
                            key={count}
                            type="button"
                            variant={newItem.photos === count ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewItem(prev => ({ ...prev, photos: count }))}
                          >
                            {count}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy Notice:</strong> Your contact information will only be visible to users who click "Contact Owner/Finder". 
                      We recommend using a phone number you're comfortable sharing with fellow travelers.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Report {newItem.type === 'lost' ? 'Lost' : 'Found'} Item
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tips for Better Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Include specific details like brand, color, size, and unique features</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Mention exact location and time when item was lost/found</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Add photos if available - they significantly increase success rate</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Keep your contact information updated and respond promptly</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}