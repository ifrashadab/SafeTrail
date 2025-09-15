import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PanicButton } from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import {
  Users,
  MessageCircle,
  MapPin,
  Calendar,
  Star,
  Heart,
  Share2,
  PlusCircle,
  Search,
  Filter,
  Camera,
  Compass,
  Clock,
  DollarSign,
  AlertCircle,
  Send,
  User,
} from "lucide-react";

interface User {
  id: string;
  touristId: string;
  fullName: string;
  profileCompleted: boolean;
}

interface TravelGroup {
  id: string;
  title: string;
  destination: string;
  date: string;
  members: number;
  maxMembers: number;
  organizer: string;
  cost: string;
  description: string;
  tags: string[];
  difficulty: 'Easy' | 'Moderate' | 'Hard';
}

interface TravelPost {
  id: string;
  author: string;
  destination: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

const travelGroups: TravelGroup[] = [
  {
    id: "1",
    title: "Kaziranga Safari Adventure",
    destination: "Kaziranga National Park, Assam",
    date: "Dec 15-17, 2024",
    members: 6,
    maxMembers: 8,
    organizer: "Priya Sharma",
    cost: "₹8,500 per person",
    description: "Join us for an amazing safari experience with elephant and jeep rides, local cuisine, and photography sessions. We'll stay at the Iora Resort.",
    tags: ["Wildlife", "Photography", "Adventure"],
    difficulty: "Easy"
  },
  {
    id: "2",
    title: "Tawang High Altitude Trek",
    destination: "Tawang, Arunachal Pradesh",
    date: "Jan 8-14, 2025",
    members: 4,
    maxMembers: 6,
    organizer: "Raj Patel",
    cost: "₹15,000 per person",
    description: "7-day trek covering Tawang Monastery, Sela Pass, and Madhuri Lake. Perfect for adventure seekers who love mountains and Buddhist culture.",
    tags: ["Trekking", "Buddhism", "Mountains"],
    difficulty: "Hard"
  },
  {
    id: "3",
    title: "Shillong Cultural Tour",
    destination: "Shillong, Meghalaya",
    date: "Dec 22-25, 2024",
    members: 8,
    maxMembers: 12,
    organizer: "Ananya Singh",
    cost: "₹6,000 per person",
    description: "Explore the Scotland of the East with visits to waterfalls, local markets, music venues, and traditional Khasi villages.",
    tags: ["Culture", "Music", "Waterfalls"],
    difficulty: "Easy"
  },
  {
    id: "4",
    title: "Dawki River Crystal Waters",
    destination: "Dawki, Meghalaya",
    date: "Jan 20-22, 2025",
    members: 3,
    maxMembers: 8,
    organizer: "Ravi Kumar",
    cost: "₹4,500 per person",
    description: "Experience the crystal-clear waters of Umngot River, boat rides, camping under the stars, and Indo-Bangladesh border views.",
    tags: ["River", "Camping", "Photography"],
    difficulty: "Moderate"
  }
];

const travelPosts: TravelPost[] = [
  {
    id: "1",
    author: "Sarah Thompson",
    destination: "Majuli Island, Assam",
    content: "Just spent 3 magical days on Majuli Island! The river island culture is incredible. Visited the Satras (monasteries), learned mask-making, and tried amazing fish curry. Budget: ₹3,500 for 3 days including accommodation at a traditional homestay. The ferry ride itself was an adventure! 🛶",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    tags: ["Culture", "Island", "Budget"]
  },
  {
    id: "2",
    author: "Michael Chen",
    destination: "Ziro Valley, Arunachal Pradesh",
    content: "Ziro Music Festival was absolutely mind-blowing! The combination of indie music and Apatani tribal culture created such a unique experience. Met amazing people from across North East. Cost: ₹12,000 for 4 days including festival pass, food, and camping. The bamboo groves are Instagram-worthy! 🎵",
    timestamp: "6 hours ago",
    likes: 45,
    comments: 15,
    tags: ["Music", "Festival", "Tribal"]
  },
  {
    id: "3",
    author: "Deepika Rao",
    destination: "Kohima, Nagaland",
    content: "Solo female traveler alert! Kohima exceeded all expectations. The Hornbill Festival was incredible - traditional dances, handicrafts, and the famous King Chilli! Felt completely safe throughout. Stayed at a lovely homestay for ₹1,200/night. The sunset from Kohima War Cemetery is unforgettable. ⛰️",
    timestamp: "1 day ago",
    likes: 67,
    comments: 22,
    tags: ["Solo", "Festival", "Safe"]
  },
  {
    id: "4",
    author: "James Wilson",
    destination: "Cherrapunji, Meghalaya",
    content: "Living bridges of Cherrapunji are nature's engineering marvels! The double-decker root bridge trek was challenging but so worth it. Tip: Go during monsoon season for full waterfalls, but carry good rain gear. Guide cost: ₹800, stay: ₹2,000/night. Rainfall here is legendary! ☔",
    timestamp: "2 days ago",
    likes: 38,
    comments: 12,
    tags: ["Trekking", "Bridges", "Monsoon"]
  }
];

const TravelerConnect = () => {
  const [user, setUser] = useState<User | null>(null);
  const [newGroupData, setNewGroupData] = useState({
    title: "",
    destination: "",
    date: "",
    maxMembers: "",
    cost: "",
    description: "",
  });
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    // NEW: Use toast notification instead of alert
    toast.success(`🎉 Travel group "${newGroupData.title}" created! Group ID: TG${Date.now()}. Now live for others to join.`);
    setNewGroupData({ title: "", destination: "", date: "", maxMembers: "", cost: "", description: "" });
  };

  const handleJoinGroup = (group: TravelGroup) => {
    // NEW: Use toast notification instead of alert
    toast.success(`✅ Join request sent for "${group.title}"! ${group.organizer} will contact you soon.`);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    // NEW: Use toast notification instead of alert
    toast.success(`📝 Travel experience about ${selectedDestination || "North East India"} shared with the community!`);
    setNewPostContent("");
    setSelectedDestination("");
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
            <div className="bg-accent text-accent-foreground p-4 rounded-full mr-4">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Traveler Connect</h1>
              <p className="text-muted-foreground">Connect with fellow travelers exploring North East</p>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-accent mb-2" data-testid="text-active-travelers">1,247</div>
              <div className="text-muted-foreground">Active Travelers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-travel-groups">89</div>
              <div className="text-muted-foreground">Active Groups</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="text-destinations">156</div>
              <div className="text-muted-foreground">Destinations Covered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2" data-testid="text-success-rate">96%</div>
              <div className="text-muted-foreground">Trip Success Rate</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="groups">Travel Groups</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="create-group">Create Group</TabsTrigger>
            <TabsTrigger value="share-experience">Share Story</TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input placeholder="Search groups by destination..." data-testid="input-search-groups" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {travelGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{group.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-4 w-4" />
                            {group.destination}
                          </CardDescription>
                        </div>
                        <Badge variant={group.difficulty === 'Easy' ? 'secondary' : group.difficulty === 'Hard' ? 'destructive' : 'default'}>
                          {group.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{group.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>{group.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>{group.members}/{group.maxMembers} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-600" />
                          <span>{group.organizer}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleJoinGroup(group)}
                          className="flex-1"
                          data-testid={`button-join-group-${group.id}`}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                        <Button variant="outline" data-testid={`button-view-details-${group.id}`}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experiences">
            <div className="space-y-6">
              {travelPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{post.author}</h4>
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.destination}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm hover:text-primary">
                          <Heart className="h-4 w-4" />
                          <span data-testid={`text-likes-${post.id}`}>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                          <span data-testid={`text-comments-${post.id}`}>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm hover:text-primary">
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create-group">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Create New Travel Group
                </CardTitle>
                <CardDescription>
                  Organize a group trip to explore North East India together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Group Title *</label>
                      <Input
                        data-testid="input-group-title"
                        placeholder="e.g., Kaziranga Wildlife Safari"
                        value={newGroupData.title}
                        onChange={(e) => setNewGroupData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Destination *</label>
                      <Input
                        data-testid="input-group-destination"
                        placeholder="e.g., Kaziranga National Park, Assam"
                        value={newGroupData.destination}
                        onChange={(e) => setNewGroupData(prev => ({ ...prev, destination: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Travel Dates *</label>
                      <Input
                        data-testid="input-group-date"
                        placeholder="e.g., Dec 15-17, 2024"
                        value={newGroupData.date}
                        onChange={(e) => setNewGroupData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Members *</label>
                      <Input
                        data-testid="input-group-max-members"
                        type="number"
                        placeholder="8"
                        value={newGroupData.maxMembers}
                        onChange={(e) => setNewGroupData(prev => ({ ...prev, maxMembers: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cost per Person (₹) *</label>
                      <Input
                        data-testid="input-group-cost"
                        placeholder="8500"
                        value={newGroupData.cost}
                        onChange={(e) => setNewGroupData(prev => ({ ...prev, cost: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <Textarea
                      data-testid="textarea-group-description"
                      placeholder="Describe your trip plan, activities, accommodation, and what's included in the cost..."
                      value={newGroupData.description}
                      onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" className="w-full" data-testid="button-create-group">
                    Create Travel Group
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="share-experience">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Share Your Travel Experience
                </CardTitle>
                <CardDescription>
                  Help other travelers by sharing your North East India adventures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Destination Visited</label>
                  <Input
                    data-testid="input-post-destination"
                    placeholder="e.g., Tawang Monastery, Arunachal Pradesh"
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Share Your Experience *</label>
                  <Textarea
                    data-testid="textarea-post-content"
                    placeholder="Tell us about your travel experience, budget, tips, highlights, and anything that would help fellow travelers..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    required
                    className="min-h-[150px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreatePost}
                    className="flex-1"
                    disabled={!newPostContent.trim()}
                    data-testid="button-create-post"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Share Experience
                  </Button>
                  <Button variant="outline" data-testid="button-add-photos">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips for Good Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Tips for Helpful Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1">
                    1
                  </Badge>
                  <span className="text-sm">Include specific costs in ₹ (accommodation, food, transport, activities)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1">
                    2
                  </Badge>
                  <span className="text-sm">Mention safety tips and challenges you faced</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1">
                    3
                  </Badge>
                  <span className="text-sm">Share local contact information and recommended guides</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs mt-1">
                    4
                  </Badge>
                  <span className="text-sm">Add seasonal information and best visiting times</span>
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

export default TravelerConnect;