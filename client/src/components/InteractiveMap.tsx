import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { MapPin, Hotel, Navigation, Star, Phone, Shield, AlertTriangle, CheckCircle } from "lucide-react";

// Interfaces
interface Location {
  lat: number; 
  lng: number;
}

interface Hotel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  price: string;
  phone: string;
  distance: string;
}

interface SafetyZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  color: "green" | "yellow" | "red";
  level: string;
  description: string;
}

// Mock data for North East India
const mockHotels: Hotel[] = [
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
    name: "Shillong Pine Resort",
    lat: 25.5788,
    lng: 91.8933,
    rating: 4.3,
    price: "₹5,800/night",
    phone: "+91-364-250-3000", 
    distance: "5.2 km"
  },
  {
    id: "4",
    name: "Tawang Inn", 
    lat: 27.5856,
    lng: 91.8697,
    rating: 4.0,
    price: "₹2,800/night",
    phone: "+91-379-422-3456",
    distance: "3.7 km"
  }
];

const safetyZones: SafetyZone[] = [
  {
    id: "1",
    name: "Shillong Market Area",
    lat: 25.5788,
    lng: 91.8933,
    radius: 1200,
    color: "green", 
    level: "Safe",
    description: "Well-patrolled tourist area with police presence"
  },
  {
    id: "2", 
    name: "Kaziranga Core Zone",
    lat: 26.5774,
    lng: 93.1717,
    radius: 2000,
    color: "green",
    level: "Safe", 
    description: "Protected national park area with rangers"
  },
  {
    id: "3",
    name: "Border Checkpoint",
    lat: 25.1167, 
    lng: 91.7667,
    radius: 1500,
    color: "yellow",
    level: "Caution",
    description: "Border area - exercise caution, carry proper ID"
  },
  {
    id: "4",
    name: "Remote Forest Road",
    lat: 25.5138,
    lng: 90.2206,
    radius: 1800,
    color: "red",
    level: "Danger", 
    description: "Remote area with poor connectivity - travel in groups"
  }
];

// Map location updater component
function LocationUpdater({ center }: { center: Location }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

// Get zone color helper
const getZoneColor = (color: string) => {
  switch (color) {
    case 'green': return '#10b981';
    case 'yellow': return '#f59e0b'; 
    case 'red': return '#ef4444';
    default: return '#6b7280';
  }
};

// Simple notification function
const showNotification = (message: string) => {
  // Create a simple notification div
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3b82f6;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-size: 14px;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 3000);
};

export default function InteractiveMap() {
  const [userLocation, setUserLocation] = useState<Location>({ lat: 26.5774, lng: 93.1717 });
  const [hotels] = useState<Hotel[]>(mockHotels);
  const [zones] = useState<SafetyZone[]>(safetyZones);
  const [isLoading, setIsLoading] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    showNotification("Getting your location...");
    
    if (!navigator.geolocation) {
      showNotification("Geolocation not supported by this browser");
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
        showNotification("📍 Location updated successfully!");
      },
      (error) => {
        console.error("Error getting location:", error);
        showNotification("Using default location (North East India)");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Handle interactions
  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel === selectedHotel ? null : hotel);
    showNotification(`Selected: ${hotel.name}`);
  };

  const handleCall = (hotel: Hotel) => {
    showNotification(`📞 Calling ${hotel.name}`);
  };

  const handleDirections = (hotel: Hotel) => {
    showNotification(`🗺️ Getting directions to ${hotel.name}`);
  };

  const handleBook = (hotel: Hotel) => {
    showNotification(`🏨 Booking ${hotel.name}...`);
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f8fafc'
    }}>
      
      {/* Header */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '28px', 
              fontWeight: 'bold',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <MapPin size={32} color="#3b82f6" />
              Interactive Travel Map
            </h1>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '16px' }}>
              North East India • {hotels.length} Hotels • {zones.length} Safety Zones
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={getCurrentLocation}
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Navigation size={16} />
              {isLoading ? 'Getting Location...' : 'Update Location'}
            </button>
            
            <button
              onClick={() => setShowZones(!showZones)}
              style={{
                padding: '12px 24px',
                backgroundColor: showZones ? '#10b981' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Shield size={16} />
              {showZones ? 'Hide Safety Zones' : 'Show Safety Zones'}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: '500', color: '#374151' }}>Safety Levels:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            <span style={{ fontSize: '14px', color: '#374151' }}>Safe Zone</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <span style={{ fontSize: '14px', color: '#374151' }}>Caution</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
            <span style={{ fontSize: '14px', color: '#374151' }}>Danger</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        
        {/* Map */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={8}
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <LocationUpdater center={userLocation} />
            
            {/* Safety Zones - These should be VERY visible now */}
            {showZones && zones.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: getZoneColor(zone.color),
                  fillColor: getZoneColor(zone.color),
                  fillOpacity: 0.25,
                  weight: 4,
                  opacity: 0.8
                }}
              >
                <Popup>
                  <div style={{ padding: '8px', minWidth: '200px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                      {zone.name}
                    </h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: getZoneColor(zone.color),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      {zone.level.toUpperCase()}
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#374151' }}>
                      {zone.description}
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}
            
            {/* User Location - Blue marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div style={{ textAlign: 'center', padding: '4px' }}>
                  <strong style={{ fontSize: '14px' }}>📍 Your Location</strong><br/>
                  <small style={{ color: '#6b7280' }}>
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </small>
                </div>
              </Popup>
            </Marker>

            {/* Hotel Markers - Red markers */}
            {hotels.map((hotel) => (
              <Marker 
                key={hotel.id} 
                position={[hotel.lat, hotel.lng]}
                eventHandlers={{
                  click: () => handleHotelSelect(hotel)
                }}
              >
                <Popup>
                  <div style={{ minWidth: '220px', padding: '8px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Hotel size={16} />
                      {hotel.name}
                    </h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: '14px' }}>{hotel.rating}/5</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>{hotel.price}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>📍 {hotel.distance} away</div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(hotel);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Phone size={12} />
                        Call
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirections(hotel);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Navigation size={12} />
                        Directions
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Hotels List */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Hotel size={20} />
              Nearby Hotels
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {hotels.map((hotel) => (
                <div 
                  key={hotel.id}
                  onClick={() => handleHotelSelect(hotel)}
                  style={{
                    padding: '16px',
                    marginBottom: '12px',
                    border: selectedHotel?.id === hotel.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedHotel?.id === hotel.id ? '#eff6ff' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '6px' }}>
                    {hotel.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    <span>{hotel.rating}/5</span>
                    <span>•</span>
                    <span>{hotel.distance}</span>
                    <span>•</span>
                    <span style={{ color: '#10b981', fontWeight: '500' }}>{hotel.price}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(hotel);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      📞 Call
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBook(hotel);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      🏨 Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Summary */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} />
              Safety Overview
            </h3>
            
            {zones.map((zone) => (
              <div key={zone.id} style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: getZoneColor(zone.color)
                  }}></div>
                  <span style={{ fontWeight: '500', fontSize: '14px' }}>{zone.name}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginLeft: '28px' }}>
                  {zone.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}