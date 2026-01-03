import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, Clock, IndianRupee, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import { tripApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Itinerary = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'

  useEffect(() => {
    if (id) {
      loadTrip();
    }
  }, [id]);

  const loadTrip = async () => {
    try {
      setIsLoading(true);
      // Get user trips first to find the specific trip
      const userTrips = await tripApi.getTripsByUser(user._id);
      const foundTrip = userTrips.find(t => t._id === id);
      
      if (!foundTrip) {
        toast({
          title: 'Trip not found',
          description: 'The requested trip could not be found',
          variant: 'destructive',
        });
        return;
      }
      
      setTrip(foundTrip);
    } catch (error) {
      console.error('Error loading trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trip',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading trip...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Trip not found</h1>
            <Link to="/trips">
              <Button>Back to Trips</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <Link to="/trips" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-5 h-5" />
              Back to Trips
            </Link>
            
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
              <img
                src={trip.coverImage ? `data:${trip.coverImage.contentType};base64,${trip.coverImage.data.toString('base64')}` : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'}
                alt={trip.tripName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">{trip.tripName}</h1>
                <p className="text-primary-foreground/80">{trip.description || 'No description available'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-sage" />
                <span>Multiple destinations</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to={`/create-trip/${trip._id}`}>
                <Button variant="accent" className="gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Trip
                </Button>
              </Link>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Timeline View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              List View
            </Button>
          </div>

          {/* Itinerary Builder */}
          <ItineraryBuilder tripId={trip._id} trip={trip} />
        </div>
      </main>
    </div>
  );
};

export default Itinerary;
