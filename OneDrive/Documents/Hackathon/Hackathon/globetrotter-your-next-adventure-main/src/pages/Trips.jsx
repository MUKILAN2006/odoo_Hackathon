import { Link } from "react-router-dom";
import { Plus, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { trips } from "@/data/mockData";

const Trips = () => {
  const hasTrips = trips.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <section className="mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  My Trips
                </h1>
                <p className="text-muted-foreground">
                  Manage and view all your travel plans
                </p>
              </div>
              <Link to="/create-trip">
                <Button variant="accent" size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Trip
                </Button>
              </Link>
            </div>
          </section>

          {/* Trips Grid or Empty State */}
          {hasTrips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-sky-light flex items-center justify-center mb-6">
                <Plane className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No trips yet
              </h2>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Start planning your first adventure! Create a trip to organize your destinations, activities, and budget.
              </p>
              <Link to="/create-trip">
                <Button variant="accent" size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Trip
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Trips;
