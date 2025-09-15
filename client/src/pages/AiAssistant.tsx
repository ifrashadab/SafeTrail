import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PanicButton } from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import {
  Bot,
  Send,
  MapPin,
  Calendar,
  Cloud,
  DollarSign,
  Star,
  Mountain,
  Camera,
  Utensils,
  Car,
  Bed,
  AlertTriangle,
  Clock,
  User,
  Heart,
} from "lucide-react";

interface User {
  id: string;
  touristId: string;
  fullName: string;
  profileCompleted: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickQuestions = [
  "Best time to visit Kaziranga National Park?",
  "How much budget needed for 7 days in North East?",
  "Is Tawang safe for solo female travelers?",
  "What are the permit requirements for Arunachal Pradesh?",
  "Best local food to try in Shillong?",
  "How to reach Dawki from Guwahati by train?",
];

const aiResponses = [
  {
    trigger: "kaziranga",
    response: "🦏 **Kaziranga National Park Insights:**\n\n• **Best Time:** November to April (dry season)\n• **Safari Costs:** Elephant safari ₹175, Jeep safari ₹500-800\n• **Accommodation:** Budget lodges ₹1,200-2,000/night, luxury resorts ₹4,000-8,000/night\n• **Safety:** Very safe, but follow park guidelines\n• **What to Expect:** One-horned rhinos, tigers, elephants, and over 480 bird species\n\n**Pro Tip:** Book safaris in advance during peak season (Dec-Feb). Early morning safaris (6 AM) offer best wildlife sightings!",
    suggestions: ["Show me Kaziranga accommodation options", "What should I pack for safari?", "Are there any cultural sites near Kaziranga?"]
  },
  {
    trigger: "budget",
    response: "💰 **7-Day North East Budget Breakdown:**\n\n**Budget Travel (₹15,000-25,000):**\n• Accommodation: ₹800-1,500/night\n• Food: ₹300-500/day\n• Transport: ₹3,000-5,000 total\n• Activities: ₹2,000-4,000 total\n\n**Mid-Range (₹25,000-45,000):**\n• Accommodation: ₹1,500-3,000/night\n• Food: ₹500-800/day\n• Private transport: ₹8,000-12,000\n• Activities: ₹4,000-8,000\n\n**Luxury (₹45,000+):**\n• Premium resorts: ₹4,000-10,000/night\n• Fine dining: ₹800-1,500/day\n• Private SUV with driver: ₹15,000-25,000\n• Premium experiences: ₹10,000+",
    suggestions: ["Create detailed 7-day itinerary", "What are the must-visit places?", "How to save money on accommodation?"]
  },
  {
    trigger: "tawang",
    response: "🏔️ **Tawang Travel Guide:**\n\n• **Safety:** Very safe, but high altitude (10,000+ feet) requires acclimatization\n• **Best Time:** March to October (roads accessible)\n• **Permits:** Inner Line Permit (ILP) required - get from Guwahati or online (₹50)\n• **Accommodation:** Monastery guest houses ₹500-800, hotels ₹1,200-3,000\n• **Key Attractions:** Tawang Monastery, Sela Pass, Madhuri Lake\n\n**For Solo Female Travelers:**\n✅ Generally very safe and welcoming\n✅ Local Buddhist culture is respectful\n⚠️ Carry altitude sickness medication\n⚠️ Weather can change rapidly",
    suggestions: ["Show Tawang 3-day itinerary", "What clothes to pack for Tawang?", "How to get ILP for Arunachal?"]
  },
  {
    trigger: "permits",
    response: "📋 **Permit Requirements for North East:**\n\n**Inner Line Permit (ILP) Required:**\n• **Arunachal Pradesh:** ₹50 (Indian citizens)\n• **Mizoram:** ₹50 (Indian citizens)\n• **Nagaland:** ₹50 (Indian citizens)\n\n**Where to Get ILP:**\n• Online: www.ilp.gov.in\n• Resident Commissioner offices in major cities\n• Border check posts (may take longer)\n\n**No Permits Required:**\n• Assam, Meghalaya, Tripura, Manipur\n\n**Processing Time:** 1-3 working days online, instant at some border points\n\n**Documents Needed:** Valid photo ID, passport-size photos, travel dates",
    suggestions: ["Help with online ILP application", "Show me border entry points", "What if I don't have ILP at border?"]
  },
  {
    trigger: "food",
    response: "🍜 **Must-Try North East Delicacies:**\n\n**Assam:**\n• Fish Tenga (₹120-200) - tangy fish curry\n• Assam Tea Experience (₹200-500)\n• Pitha (rice cakes) (₹30-80)\n\n**Meghalaya:**\n• Jadoh (₹80-150) - rice and meat dish\n• Momos (₹40-80) - Tibetan dumplings\n• Black sesame ice cream (₹60-100)\n\n**Arunachal Pradesh:**\n• Thukpa (₹60-120) - noodle soup\n• Apong (rice wine) (₹100-200)\n• Bamboo shoot curry (₹80-150)\n\n**Food Safety:** Stick to busy local restaurants, avoid raw vegetables in remote areas, bottled water ₹20-40",
    suggestions: ["Best restaurants in Guwahati", "Vegetarian options in North East", "Local markets for food shopping"]
  },
  {
    trigger: "transport",
    response: "🚂 **Guwahati to Dawki Transport Options:**\n\n**By Train + Road (Recommended):**\n• Guwahati to Shillong: Bus/taxi ₹200-500 (3 hours)\n• Shillong to Dawki: Shared taxi ₹150-200 (2 hours)\n• Total time: 5-6 hours, Cost: ₹350-700\n\n**Direct Taxi:**\n• Private taxi: ₹3,500-5,000 (5 hours direct)\n• Shared taxi: ₹800-1,200 per person\n\n**By Air:**\n• No direct flights to Dawki\n• Fly to Shillong helipad (helicopter service): ₹3,000-5,000\n\n**Best Route:** Guwahati → Shillong → Dawki via NH6 (most scenic route through Meghalaya hills)",
    suggestions: ["Book shared taxi to Dawki", "Best stops between Guwahati-Dawki", "Is Dawki worth visiting?"]
  }
];

const AiAssistant = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: 'assistant',
      content: `🙏 Namaste! I'm your AI travel companion for exploring the Seven Sisters states of North East India! 

I can help you with:
• Personalized itineraries for Kaziranga, Tawang, Shillong
• Budget planning in ₹ (Indian Rupees)
• Permit requirements and safety tips
• Local food recommendations and cultural insights
• Real-time weather and travel advisories

What would you like to know about North East India? 🏔️`,
      timestamp: new Date(),
      suggestions: ["Plan my 7-day North East trip", "What are the permit requirements?", "Best time to visit Kaziranga?"]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerInput = inputMessage.toLowerCase();
      let aiResponse = aiResponses.find(response => 
        lowerInput.includes(response.trigger)
      );

      // NEW: Show notification when AI responds
      toast.success("🤖 AI Assistant responded to your query!");

      if (!aiResponse) {
        aiResponse = {
          trigger: "default",
          response: `I understand you're asking about "${inputMessage}". While I'd love to help with detailed information, here are some general tips for North East India:

• Always carry valid ID and permits for restricted areas
• Weather can change quickly in hill stations
• Local cuisine is delicious but start with small portions
• Respect local customs and tribal traditions
• Emergency services: 100 (Police), 108 (Medical)

For specific queries, try asking about popular destinations like Kaziranga, Tawang, Shillong, or topics like budget, permits, or food!`,
          suggestions: ["Tell me about Kaziranga National Park", "What permits do I need?", "Plan a budget-friendly trip"]
        };
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.response,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
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
            <div className="bg-primary text-primary-foreground p-4 rounded-full mr-4">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Travel Assistant</h1>
              <p className="text-muted-foreground">Personalized recommendations for Seven Sisters states</p>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-medium">Smart Itineraries</div>
              <div className="text-sm text-muted-foreground">Personalized routes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium">Budget Planning</div>
              <div className="text-sm text-muted-foreground">Cost in ₹</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Cloud className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="font-medium">Weather Insights</div>
              <div className="text-sm text-muted-foreground">Real-time updates</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="font-medium">Safety Alerts</div>
              <div className="text-sm text-muted-foreground">24/7 monitoring</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Chat with AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask me anything about traveling in North East India!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" data-testid="chat-messages">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {message.type === 'assistant' ? (
                              <Bot className="h-4 w-4" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                            <span className="text-xs">
                              {message.type === 'assistant' ? 'AI Assistant' : 'You'}
                            </span>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="text-sm whitespace-pre-line">{message.content}</div>
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  data-testid={`button-suggestion-${index}`}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-muted-foreground rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <span className="text-sm">AI is typing...</span>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about North East India travel..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      data-testid="input-chat-message"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left text-xs"
                    onClick={() => handleQuickQuestion(question)}
                    data-testid={`button-quick-question-${index}`}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Current Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Current Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weather in Guwahati</span>
                  <Badge>28°C Sunny</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tourist Season</span>
                  <Badge className="bg-green-100 text-green-800">Peak</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Road Conditions</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Caution</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Safety Level</span>
                  <Badge className="bg-green-100 text-green-800">Safe</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Popular Destinations */}
            <Card>
              <CardHeader>
                <CardTitle>Popular This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mountain className="h-4 w-4 text-primary" />
                  <span>Tawang Monastery</span>
                  <Badge variant="secondary">₹500 entry</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Camera className="h-4 w-4 text-primary" />
                  <span>Dawki Crystal River</span>
                  <Badge variant="secondary">₹300 boating</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4 text-primary" />
                  <span>Kaziranga Safari</span>
                  <Badge variant="secondary">₹175 safari</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Utensils className="h-4 w-4 text-primary" />
                  <span>Shillong Food Walk</span>
                  <Badge variant="secondary">₹200/person</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cost Savings */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹12,450</div>
                  <div className="text-sm text-muted-foreground">Saved by travelers using AI tips</div>
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

export default AiAssistant;