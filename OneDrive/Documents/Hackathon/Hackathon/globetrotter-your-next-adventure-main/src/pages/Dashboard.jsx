import { Link } from "react-router-dom";
import { Plus, Wallet, TrendingUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { DestinationCard } from "@/components/DestinationCard";
import { trips, destinations, user } from "@/data/mockData";

const Dashboard = () => {
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
                  Welcome back, <span className="text-gradient">{user.name}</span>! 👋
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
                  <p className="text-2xl font-bold text-foreground">{trips.length}</p>
                  <p className="text-muted-foreground">Planned Trips</p>
                </div>
              </div>
            </div>

            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-sage" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-muted-foreground">Countries Visited</p>
                </div>
              </div>
            </div>

            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-coral-light flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">$2,450</p>
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
              {trips.slice(0, 3).map((trip, index) => (
                <div
                  key={trip.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <TripCard
                    id={trip.id}
                    name={trip.name}
                    startDate={trip.startDate}
                    endDate={trip.endDate}
                    destinations={trip.destinations}
                    imageUrl={trip.imageUrl}
                    onEdit={() => console.log("Edit", trip.id)}
                    onDelete={() => console.log("Delete", trip.id)}
                  />
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
