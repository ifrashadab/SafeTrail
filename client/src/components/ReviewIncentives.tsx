import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast"; // NEW: Import toast for notifications
import { 
  Star, 
  Gift, 
  Trophy, 
  Coins, 
  MapPin,
  Camera,
  Award,
  Target,
  CheckCircle
} from "lucide-react";

interface Review {
  id: string;
  location: string;
  rating: number;
  content: string;
  photos: number;
  pointsEarned: number;
  timestamp: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  type: 'discount' | 'voucher' | 'badge' | 'experience';
  icon: string;
  available: boolean;
}

const sampleRewards: Reward[] = [
  {
    id: "1",
    title: "10% Hotel Discount",
    description: "Get 10% off at partner hotels across North East",
    pointsRequired: 100,
    type: "discount",
    icon: "🏨",
    available: true
  },
  {
    id: "2",
    title: "Free Safari Ticket",
    description: "Complimentary elephant safari at Kaziranga National Park",
    pointsRequired: 250,
    type: "voucher", 
    icon: "🐘",
    available: true
  },
  {
    id: "3",
    title: "Explorer Badge",
    description: "Digital badge for visiting 5+ destinations",
    pointsRequired: 150,
    type: "badge",
    icon: "🏆",
    available: false
  },
  {
    id: "4",
    title: "Local Guide Experience",
    description: "Free half-day guided tour with local expert",
    pointsRequired: 300,
    type: "experience",
    icon: "🗺️",
    available: true
  }
];

export function ReviewIncentives() {
  const [userPoints, setUserPoints] = useState(85);
  const [userLevel, setUserLevel] = useState("Bronze Explorer");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    location: "",
    rating: 5,
    content: "",
    photos: 0
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.location || !newReview.content) {
      toast.error("Please fill in location and review content"); // NEW: Use toast instead of alert
      return;
    }

    // Calculate points based on review quality
    let pointsEarned = 20; // Base points
    if (newReview.content.length > 100) pointsEarned += 10; // Detailed review
    if (newReview.photos > 0) pointsEarned += (newReview.photos * 5); // Photo bonus
    if (newReview.rating >= 4) pointsEarned += 5; // Positive review bonus

    const review: Review = {
      id: Date.now().toString(),
      ...newReview,
      pointsEarned,
      timestamp: "Just now"
    };

    setReviews(prev => [review, ...prev]);
    setUserPoints(prev => prev + pointsEarned);
    setNewReview({ location: "", rating: 5, content: "", photos: 0 });

    // NEW: Show incentive notification with toast
    toast.success(`🎉 Review Submitted! +${pointsEarned} points earned. Total: ${userPoints + pointsEarned} points`);
  };

  const handleClaimReward = (reward: Reward) => {
    if (userPoints >= reward.pointsRequired && reward.available) {
      setUserPoints(prev => prev - reward.pointsRequired);
      // NEW: Use toast for reward claim notification
      toast.success(`🎁 ${reward.title} claimed! ${reward.pointsRequired} points used. Remaining: ${userPoints - reward.pointsRequired}`);
    } else if (!reward.available) {
      toast.error("This reward is currently unavailable. Please check back later!"); // NEW: Use toast
    } else {
      toast.error(`Insufficient points! You need ${reward.pointsRequired - userPoints} more points.`); // NEW: Use toast
    }
  };

  const getProgressToNextLevel = () => {
    const nextLevelPoints = 200; // Silver Explorer
    return Math.min((userPoints / nextLevelPoints) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* User Points & Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Rewards Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{userPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">{userLevel}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{reviews.length}</div>
              <div className="text-sm text-muted-foreground">Reviews Written</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Silver Explorer</span>
              <span>{userPoints}/200 points</span>
            </div>
            <Progress value={getProgressToNextLevel()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Submit Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Write a Review & Earn Points
          </CardTitle>
          <CardDescription>
            Share your travel experience and earn reward points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Location Visited *</label>
              <Input
                placeholder="e.g., Kaziranga National Park, Tawang Monastery"
                value={newReview.location}
                onChange={(e) => setNewReview(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Rating *</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant={newReview.rating >= rating ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                    className="w-10 h-10 p-0"
                  >
                    <Star className={`h-4 w-4 ${newReview.rating >= rating ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Your Review *</label>
              <Textarea
                placeholder="Share your experience, tips, costs, and recommendations for other travelers..."
                value={newReview.content}
                onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                required
                className="min-h-[100px]"
              />
              <div className="text-xs text-muted-foreground mt-1">
                💡 Detailed reviews (100+ characters) earn bonus points!
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Photos (Optional)</label>
              <div className="flex gap-2 mt-2">
                {[0, 1, 2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    type="button"
                    variant={newReview.photos === count ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewReview(prev => ({ ...prev, photos: count }))}
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    {count}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                📸 Each photo adds 5 bonus points!
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Points You'll Earn:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>• Base review: 20 points</div>
                <div>• Detailed review (100+ chars): +10 points</div>
                <div>• Photos: +{newReview.photos * 5} points</div>
                <div>• Positive rating (4-5 stars): +5 points</div>
                <div className="font-semibold pt-1 border-t border-blue-200">
                  Total: ~{20 + (newReview.content.length > 100 ? 10 : 0) + (newReview.photos * 5) + (newReview.rating >= 4 ? 5 : 0)} points
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Gift className="h-4 w-4 mr-2" />
              Submit Review & Earn Points
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
          <CardDescription>
            Redeem your points for exclusive rewards and experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleRewards.map((reward) => (
              <Card key={reward.id} className={`${!reward.available ? 'opacity-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <h4 className="font-semibold">{reward.title}</h4>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{reward.pointsRequired} points</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(reward)}
                      disabled={userPoints < reward.pointsRequired || !reward.available}
                    >
                      {userPoints >= reward.pointsRequired && reward.available ? 'Claim' : 'Need More Points'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {review.location}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.timestamp}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    +{review.pointsEarned} points
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{review.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}