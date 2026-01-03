import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus, Wallet, TrendingUp, MapPin, Loader2, Calendar, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { DestinationCard } from "@/components/DestinationCard";
import { destinations } from "@/data/mockData";
import { tripApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isBudgetLoading, setIsBudgetLoading] = useState(true);
  const [tripBudgets, setTripBudgets] = useState({});
  const [tripDestinations, setTripDestinations] = useState({});

  // Debug user object
  console.log('Dashboard - User object:', user);
  console.log('Dashboard - User name:', user?.name);
  console.log('Dashboard - User object keys:', user ? Object.keys(user) : 'No user');

  // Calculate individual trip budget
  const calculateTripBudget = async (trip) => {
    try {
      let tripTotal = 0;
      
      // Get stops for this trip
      const stops = await tripApi.getStopsByTrip(trip._id);
      
      // Get activities for each stop
      for (const stop of stops) {
        const activities = await tripApi.getActivitiesByStop(stop._id);
        activities.forEach(activity => {
          if (activity.cost && !isNaN(activity.cost)) {
            tripTotal += parseFloat(activity.cost);
          }
        });
      }
      
      return tripTotal;
    } catch (error) {
      console.error('Error calculating trip budget:', error);
      return 0;
    }
  };

  // Calculate destinations count for a trip
  const calculateTripDestinations = async (trip) => {
    try {
      const stops = await tripApi.getStopsByTrip(trip._id);
      return stops ? stops.length : 0;
    } catch (error) {
      console.error('Error calculating trip destinations:', error);
      return 0;
    }
  };

  // Calculate budgets for all trips
  const calculateAllTripBudgets = async (trips) => {
    try {
      const budgets = {};
      
      for (const trip of trips) {
        const budget = await calculateTripBudget(trip);
        budgets[trip._id] = budget;
      }
      
      setTripBudgets(budgets);
    } catch (error) {
      console.error('Error calculating all trip budgets:', error);
    }
  };

  // Calculate destinations for all trips
  const calculateAllTripDestinations = async (trips) => {
    try {
      const destinations = {};
      
      for (const trip of trips) {
        const destinationCount = await calculateTripDestinations(trip);
        destinations[trip._id] = destinationCount;
      }
      
      setTripDestinations(destinations);
    } catch (error) {
      console.error('Error calculating all trip destinations:', error);
    }
  };
  const calculateTotalBudget = async (trips) => {
    try {
      setIsBudgetLoading(true);
      let total = 0;
      
      for (const trip of trips) {
        // Get stops for this trip
        const stops = await tripApi.getStopsByTrip(trip._id);
        
        // Get activities for each stop
        for (const stop of stops) {
          const activities = await tripApi.getActivitiesByStop(stop._id);
          activities.forEach(activity => {
            if (activity.cost && !isNaN(activity.cost)) {
              total += parseFloat(activity.cost);
            }
          });
        }
      }
      
      setTotalBudget(total);
    } catch (error) {
      console.error('Error calculating total budget:', error);
      setTotalBudget(0);
    } finally {
      setIsBudgetLoading(false);
    }
  };

  // Fetch user trips
  useEffect(() => {
    const fetchTrips = async () => {
      console.log('Dashboard - User object:', user);
      console.log('Dashboard - User ID:', user?._id);
      
      if (!user?._id) {
        console.log('No user ID found, skipping trip fetch');
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Fetching trips for user ID:', user._id);
        const userTrips = await tripApi.getTripsByUser(user._id);
        console.log('Fetched trips:', userTrips);
        setTrips(userTrips || []);
        
        // Calculate budgets and destinations for all trips
        if (userTrips && userTrips.length > 0) {
          try {
            await Promise.all([
              calculateTotalBudget(userTrips),
              calculateAllTripBudgets(userTrips),
              calculateAllTripDestinations(userTrips)
            ]);
          } catch (calcError) {
            console.error('Error calculating trip data:', calcError);
            // Still set trips even if calculations fail
            setTotalBudget(0);
            setTripBudgets({});
            setTripDestinations({});
            setIsBudgetLoading(false);
          }
        } else {
          setTotalBudget(0);
          setTripBudgets({});
          setTripDestinations({});
          setIsBudgetLoading(false);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your trips',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  const handleDeleteTrip = async (tripId) => {
    try {
      await tripApi.deleteTrip(tripId);
      setTrips(trips.filter(trip => trip._id !== tripId));
      toast({
        title: 'Trip deleted',
        description: 'Your trip has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete trip',
        variant: 'destructive',
      });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <section className="mb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Welcome back, <span className="text-primary font-bold">{user?.name || user?.email?.split('@')[0] || 'Traveler'}</span>! 👋
                </h1>
                <p className="text-lg text-muted-foreground">
                  Ready to plan your next adventure?
                </p>
              </div>
              <Link to="/create-trip">
                <Button variant="accent" size="lg" className="gap-2 shadow-elevated">
                  <Plus className="w-5 h-5" />
                  Plan New Trip
                </Button>
              </Link>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-light flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : (trips || []).length}</p>
                  <p className="text-muted-foreground">Planned Trips</p>
                </div>
              </div>
            </div>

            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-coral-light flex items-center justify-center">
                  <IndianRupee className="w-7 h-7 text-black" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{isBudgetLoading ? '...' : `₹${totalBudget.toLocaleString()}`}</p>
                  <p className="text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Trips */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Recent Trips</h2>
              <Link to="/trips">
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (trips || []).length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground mb-4">No trips planned yet</p>
                  <Link to="/create-trip">
                    <Button variant="accent">Create Your First Trip</Button>
                  </Link>
                </div>
              ) : (
                (trips || []).slice(0, 3).map((trip, index) => {
                  console.log('Trip data:', trip);
                  console.log('Cover image:', trip.coverImage);
                  return (
                  <div
                    key={trip._id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <TripCard
                      id={trip._id}
                      name={trip.tripName}
                      startDate={new Date(trip.startDate).toLocaleDateString()}
                      endDate={new Date(trip.endDate).toLocaleDateString()}
                      destinations={tripDestinations[trip._id] || 0}
                      imageUrl={trip.coverImage && trip.coverImage.data && trip.coverImage.contentType 
                        ? `data:${trip.coverImage.contentType};base64,${trip.coverImage.data}` 
                        : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'}
                      location={trip.location || "China"}
                      rating={trip.rating || "4.8"}
                      budget={tripBudgets[trip._id] || 0}
                      travelers={trip.travelers || null}
                      onEdit={() => navigate(`/create-trip/${trip._id}`)}
                      onDelete={() => handleDeleteTrip(trip._id)}
                    />
                  </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Upcoming Activities */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Upcoming Activities</h2>
                <p className="text-muted-foreground">Your next planned activities</p>
              </div>
              <Link to="/trips">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.slice(0, 2).map((trip) => (
                <div key={trip._id} className="card-travel p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{trip.tripName}</h3>
                    <Link to={`/itinerary/${trip._id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        View Itinerary
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Multiple destinations</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="pt-2">
                      <Link to={`/itinerary/${trip._id}`}>
                        <Button variant="accent" size="sm" className="w-full gap-2">
                          <Plus className="w-4 h-4" />
                          Plan Activities
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Destinations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
                <p className="text-muted-foreground">Discover your next destination</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((destination, index) => (
                <div
                  key={destination.name}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <DestinationCard {...destination} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
