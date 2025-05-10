
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Mock data for bookstores
const mockBookstores = [
  {
    id: 1,
    name: "City Lights Bookstore",
    address: "123 Book Street, San Francisco, CA 94133",
    distance: 0.8,
    phone: "(415) 555-1234",
    hours: "9:00 AM - 9:00 PM",
    rating: 4.7,
  },
  {
    id: 2,
    name: "BookHaven",
    address: "456 Reader Avenue, San Francisco, CA 94109",
    distance: 1.2,
    phone: "(415) 555-5678",
    hours: "10:00 AM - 8:00 PM",
    rating: 4.5,
  },
  {
    id: 3,
    name: "The Reading Corner",
    address: "789 Literary Lane, San Francisco, CA 94102",
    distance: 2.1,
    phone: "(415) 555-9012",
    hours: "8:00 AM - 10:00 PM",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Page Turner Books",
    address: "101 Novel Road, San Francisco, CA 94117",
    distance: 2.8,
    phone: "(415) 555-3456",
    hours: "9:00 AM - 7:00 PM",
    rating: 4.3,
  },
  {
    id: 5,
    name: "Bookworm Paradise",
    address: "202 Story Street, San Francisco, CA 94110",
    distance: 3.5,
    phone: "(415) 555-7890",
    hours: "10:00 AM - 9:00 PM",
    rating: 4.6,
  },
];

const NearbyBookstores = () => {
  const [bookstores, setBookstores] = useState(mockBookstores);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getUserLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
        toast.success("Location found! Showing nearby bookstores.");
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case 1:
            errorMessage = "Permission denied. Please allow location access to find nearby bookstores.";
            break;
          case 2:
            errorMessage = "Location unavailable. Please try again later.";
            break;
          case 3:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = "An unknown error occurred. Please try again.";
        }
        setLocationError(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Sort bookstores by distance when user location is available
  useEffect(() => {
    if (userLocation) {
      // In a real app, we would fetch bookstores near the user's location from an API
      // For now, we'll just sort our mock data by distance
      const sortedBookstores = [...bookstores].sort((a, b) => a.distance - b.distance);
      setBookstores(sortedBookstores);
    }
  }, [userLocation]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    
    if (hasHalfStar) {
      stars.push("☆");
    }
    
    return (
      <div className="flex text-amber-500">
        {stars.map((star, i) => (
          <span key={i}>{star}</span>
        ))}
        <span className="ml-1 text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Find Bookstores Near You</h1>
            <p className="text-muted-foreground">
              Discover local bookstores in your area and support your community.
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-6 bg-muted">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center text-lg">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  {userLocation ? (
                    <span>Showing bookstores near your location</span>
                  ) : (
                    <span>Find bookstores near you</span>
                  )}
                </div>
                <Button 
                  onClick={getUserLocation} 
                  disabled={loading}
                  className="min-w-[200px]"
                >
                  {loading ? "Finding location..." : "Use My Location"}
                </Button>
              </div>
              
              {locationError && (
                <div className="mt-4 p-3 bg-destructive/15 text-destructive rounded-md">
                  {locationError}
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bookstore</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead className="hidden md:table-cell">Hours</TableHead>
                    <TableHead className="hidden md:table-cell">Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookstores.map((bookstore) => (
                    <TableRow key={bookstore.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bookstore.name}</div>
                          <div className="text-sm text-muted-foreground">{bookstore.address}</div>
                          <div className="text-sm text-muted-foreground md:hidden">{bookstore.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{bookstore.distance.toFixed(1)} miles</TableCell>
                      <TableCell className="hidden md:table-cell">{bookstore.hours}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {renderStars(bookstore.rating)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(bookstore.address)}`, '_blank')}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Store className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Why Visit Local Bookstores?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Support Local Businesses</h3>
                <p className="text-sm text-muted-foreground">
                  Your purchases help sustain independent bookstores and support your local economy.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Discover Unique Selections</h3>
                <p className="text-sm text-muted-foreground">
                  Local bookstores often carry curated selections and rare finds you won't see elsewhere.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Connect with Community</h3>
                <p className="text-sm text-muted-foreground">
                  Many bookstores host events, reading groups, and other activities that bring readers together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NearbyBookstores;
