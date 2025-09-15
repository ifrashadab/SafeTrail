// Interactive map component with current location, nearby hotels, and safety zones
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Hotel, Navigation, Star, Phone, Shield } from "lucide-react";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hotelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
}

interface NearbyHotel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  price: string;
  phone: string;
  distance: string;
}

// NEW: Safety zone interface
interface SafetyZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // radius in meters
  safetyLevel: 'low' | 'medium' | 'high'; // risk levels
  description: string;
}

// Mock data for nearby hotels in North East India
const mockHotels: NearbyHotel[] = [
  {
    id: "1",
    name: "Kaziranga Golf Resort",
    lat: 26.5774,
    lng: 93.1717,
    rating: 4.5,
    price: "₹4,500/night",
    phone: "+91-376-262-429",
    distance: "2.3 km"
  },
  {
    id: "2",
    name: "Wild Grass Lodge",
    lat: 26.5850,
    lng: 93.1650,
    rating: 4.2,
    price: "₹3,200/night",
    phone: "+91-376-262-085",
    distance: "1.8 km"
  },
  {
    id: "3",
    name: "Shillong Pine Borough Resort",
    lat: 25.5788,
    lng: 91.8933,
    rating: 4.3,
    price: "₹5,800/night",
    phone: "+91-364-250-3000",
    distance: "5.2 km"
  }
];

// NEW: Mock safety zones data for North East India
const mockSafetyZones: SafetyZone[] = [
  {
    id: "1",
    name: "Shillong City Center",
    lat: 25.5788,
    lng: 91.8933,
    radius: 2500,
    safetyLevel: 'low', // Low risk = Green
    description: "Well-patrolled tourist area with good infrastructure and police presence"
  },
  {
    id: "2",
    name: "Kaziranga National Park",
    lat: 26.5774,
    lng: 93.1717,
    radius: 3000,
    safetyLevel: 'low', // Low risk = Green
    description: "Protected wildlife sanctuary with ranger stations and guided tours"
  },
  {
    id: "3",
    name: "Border Checkpoint Area",
    lat: 25.1167,
    lng: 91.7667,
    radius: 2200,
    safetyLevel: 'medium', // Medium risk = Yellow
    description: "Border region - exercise caution, carry proper identification documents"
  },
  {
    id: "4",
    name: "Remote Forest Highway",
    lat: 25.5138,
    lng: 90.2206,
    radius: 2800,
    safetyLevel: 'high', // High risk = Red
    description: "Remote mountainous area with limited connectivity - travel in groups, inform others"
  },
  {
    id: "5",
    name: "Tawang Military Zone",
    lat: 27.5856,
    lng: 91.8697,
    radius: 2000,
    safetyLevel: 'medium', // Medium risk = Yellow
    description: "Sensitive military area near international border - permits required"
  },
  {
    id: "6",
    name: "Guwahati Commercial District",
    lat: 26.1445,
    lng: 91.7362,
    radius: 2800,
    safetyLevel: 'low', // Low risk = Green
    description: "Busy commercial hub with good security, hospitals, and tourist facilities"
  },
  {
    id: "7",
    name: "Dimapur Railway Junction",
    lat: 25.9044,
    lng: 93.7267,
    radius: 2400,
    safetyLevel: 'medium', // Medium risk = Yellow
    description: "Major transport hub - crowded area, watch for pickpockets and scams"
  },
  {
    id: "8",
    name: "Itanagar Government Complex",
    lat: 27.0844,
    lng: 93.6053,
    radius: 2600,
    safetyLevel: 'low', // Low risk = Green
    description: "Well-secured government area with regular patrols and CCTV coverage"
  },
  {
    id: "9",
    name: "Kohima War Cemetery Area",
    lat: 25.6751,
    lng: 94.1086,
    radius: 2200,
    safetyLevel: 'low', // Low risk = Green
    description: "Historic tourist site with good maintenance and security presence"
  },
  {
    id: "10",
    name: "Insurgency Affected Zone",
    lat: 24.8333,
    lng: 93.9500,
    radius: 3500,
    safetyLevel: 'high', // High risk = Red
    description: "Area with occasional insurgent activity - avoid travel after dark, check current status"
  },
  {
    id: "11",
    name: "Imphal Airport Vicinity",
    lat: 24.7600,
    lng: 93.8967,
    radius: 2400,
    safetyLevel: 'medium', // Medium risk = Yellow
    description: "Airport area with security but occasional protests - monitor local news"
  },
  {
    id: "12",
    name: "Aizawl City Center",
    lat: 23.7307,
    lng: 92.7173,
    radius: 2600,
    safetyLevel: 'low', // Low risk = Green
    description: "Safe hill station capital with low crime rates and friendly locals"
  },
  {
    id: "13",
    name: "Silchar Medical College Area",
    lat: 24.8333,
    lng: 92.7789,
    radius: 2000,
    safetyLevel: 'low', // Low risk = Green
    description: "Medical district with good infrastructure and emergency services"
  },
  {
    id: "14",
    name: "Border Drug Trafficking Zone",
    lat: 23.2599,
    lng: 92.9376,
    radius: 3200,
    safetyLevel: 'high', // High risk = Red
    description: "High drug trafficking activity - increased police operations, exercise extreme caution"
  },
  {
    id: "15",
    name: "Agartala International Border",
    lat: 23.8315,
    lng: 91.2868,
    radius: 2800,
    safetyLevel: 'medium', // Medium risk = Yellow
    description: "International border crossing - heavy security, long queues, carry proper documents"
  }
];

// NEW: Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// NEW: Helper function to get safety zone colors
const getSafetyZoneColor = (safetyLevel: 'low' | 'medium' | 'high') => {
  switch (safetyLevel) {
    case 'low':
      return '#10b981'; // Green
    case 'medium':
      return '#f59e0b'; // Yellow
    case 'high':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
};

// NEW: Helper function to get safety zone emoji
const getSafetyEmoji = (safetyLevel: 'low' | 'medium' | 'high') => {
  switch (safetyLevel) {
    case 'low':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'high':
      return '🔴';
    default:
      return '⚪';
  }
};

// NEW: Helper function to get safety level text
const getSafetyLevelText = (safetyLevel: 'low' | 'medium' | 'high') => {
  switch (safetyLevel) {
    case 'low':
      return 'Low Risk Zone';
    case 'medium':
      return 'Medium Risk Zone';
    case 'high':
      return 'High Risk Zone';
    default:
      return 'Unknown Risk';
  }
};

// Component to handle map centering when location changes
function LocationUpdater({ center }: { center: Location }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  
  return null;
}

export function MapComponent() {
  const [userLocation, setUserLocation] = useState<Location>({ lat: 26.5774, lng: 93.1717 }); // Default to Kaziranga
  const [liveLocationEnabled, setLiveLocationEnabled] = useState(false);
  const [nearbyHotels, setNearbyHotels] = useState<NearbyHotel[]>(mockHotels);
  const [safetyZones] = useState<SafetyZone[]>(mockSafetyZones); // NEW: Safety zones state
  const [showSafetyZones, setShowSafetyZones] = useState(true); // NEW: Toggle for safety zones
  const [isLoading, setIsLoading] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        setIsLoading(false);
        toast.success("📍 Location updated successfully!");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to get your location. Using default location.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Toggle live location tracking
  const handleLiveLocationToggle = (enabled: boolean) => {
    setLiveLocationEnabled(enabled);
    
    if (enabled) {
      getCurrentLocation();
      toast.success("🔴 Live location tracking enabled");
    } else {
      toast("📍 Live location tracking disabled", { icon: "ℹ️" });
    }
  };

  // Handle hotel contact
  const handleContactHotel = (hotel: NearbyHotel) => {
    toast.success(`📞 Calling ${hotel.name} at ${hotel.phone}`);
  };

  // Handle directions
  const handleGetDirections = (hotel: NearbyHotel) => {
    toast.success(`🗺️ Getting directions to ${hotel.name}`);
  };

  useEffect(() => {
    // Auto-update location if live tracking is enabled
    let watchId: number;
    
    if (liveLocationEnabled) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Location watch error:", error),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [liveLocationEnabled]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Map - North East India
            </CardTitle>
            <CardDescription>
              Your location, nearby accommodations, and safety zones
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="live-location"
                checked={liveLocationEnabled}
                onCheckedChange={handleLiveLocationToggle}
              />
              <Label htmlFor="live-location" className="text-sm">
                Live Location
              </Label>
            </div>
            {/* NEW: Safety zones toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="safety-zones"
                checked={showSafetyZones}
                onCheckedChange={setShowSafetyZones}
              />
              <Label htmlFor="safety-zones" className="text-sm">
                Safety Zones
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map controls */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={getCurrentLocation} 
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {isLoading ? "Getting Location..." : "Update Location"}
          </Button>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Hotel className="h-3 w-3" />
            {nearbyHotels.length} hotels nearby
          </Badge>
          {/* NEW: Safety zones badge */}
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {safetyZones.length} safety zones
          </Badge>
        </div>

        {/* NEW: Safety zones legend */}
        {showSafetyZones && (
          <div className="flex gap-4 items-center p-3 bg-muted rounded-lg text-sm">
            <span className="font-medium">Safety Levels:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>🟢 Low Risk</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>🟡 Medium Risk</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>🔴 High Risk</span>
            </div>
          </div>
        )}

        {/* Map container */}
        <div className="h-96 w-full rounded-lg overflow-hidden border">
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={8}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LocationUpdater center={userLocation} />
            
            {/* NEW: Safety zone circles */}
            {showSafetyZones && safetyZones.map((zone) => {
              const distance = calculateDistance(userLocation.lat, userLocation.lng, zone.lat, zone.lng);
              
              return (
                <Circle
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    color: getSafetyZoneColor(zone.safetyLevel),
                    fillColor: getSafetyZoneColor(zone.safetyLevel),
                    fillOpacity: 0.3,
                    weight: 4,
                    opacity: 1.0
                  }}
                >
                  <Popup>
                    <div className="min-w-64 p-2">
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {zone.name}
                      </h4>
                      
                      <div className="mb-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: getSafetyZoneColor(zone.safetyLevel),
                            color: 'white' 
                          }}
                        >
                          {getSafetyEmoji(zone.safetyLevel)} {getSafetyLevelText(zone.safetyLevel)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        📍 {distance.toFixed(1)} km from your location
                      </div>
                      
                      <p className="text-sm leading-relaxed">
                        {zone.description}
                      </p>
                    </div>
                  </Popup>
                </Circle>
              );
            })}
            
            {/* User location marker */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center">
                  <strong>📍 Your Location</strong>
                  <br />
                  <small>Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</small>
                </div>
              </Popup>
            </Marker>

            {/* Hotel markers */}
            {nearbyHotels.map((hotel) => (
              <Marker 
                key={hotel.id} 
                position={[hotel.lat, hotel.lng]} 
                icon={hotelIcon}
              >
                <Popup>
                  <div className="min-w-48">
                    <h4 className="font-semibold flex items-center gap-1">
                      <Hotel className="h-4 w-4" />
                      {hotel.name}
                    </h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{hotel.rating}/5</span>
                        <span className="ml-2 font-medium text-green-600">{hotel.price}</span>
                      </div>
                      <div className="text-muted-foreground">{hotel.distance} away</div>
                    </div>
                    <div className="flex gap-1 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleContactHotel(hotel)}
                        className="flex-1"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGetDirections(hotel)}
                        className="flex-1"
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Hotel list below map */}
        <div className="space-y-2">
          <h4 className="font-medium">Nearby Hotels & Resorts</h4>
          <div className="grid gap-2">
            {nearbyHotels.map((hotel) => (
              <div key={hotel.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h5 className="font-medium">{hotel.name}</h5>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{hotel.rating}</span>
                    <span>•</span>
                    <span>{hotel.distance}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{hotel.price}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleContactHotel(hotel)}>
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleGetDirections(hotel)}>
                    <Navigation className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW: Safety zones list */}
        {showSafetyZones && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Safety Zones Overview
            </h4>
            <div className="grid gap-2">
              {safetyZones.map((zone) => {
                const distance = calculateDistance(userLocation.lat, userLocation.lng, zone.lat, zone.lng);
                
                return (
                  <div key={zone.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{zone.name}</h5>
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: getSafetyZoneColor(zone.safetyLevel),
                            color: 'white' 
                          }}
                        >
                          {getSafetyEmoji(zone.safetyLevel)} {getSafetyLevelText(zone.safetyLevel)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        📍 {distance.toFixed(1)} km away
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {zone.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}