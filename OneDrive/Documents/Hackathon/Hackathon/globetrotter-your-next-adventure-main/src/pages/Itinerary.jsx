import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { trips } from "@/data/mockData";

const Itinerary = () => {
  const { id } = useParams();
  const trip = trips.find(t => t.id === id);

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
                src={trip.imageUrl}
                alt={trip.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">{trip.name}</h1>
                <p className="text-primary-foreground/80">{trip.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{trip.startDate} - {trip.endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 text-sage" />
                <span>{trip.destinations} destinations</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="accent" className="gap-2">
                <Edit className="w-5 h-5" />
                Edit Trip
              </Button>
              <Button variant="outline" className="gap-2">
                <Plus className="w-5 h-5" />
                Add Activity
              </Button>
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-8">
            {trip.activities && trip.activities.length > 0 ? (
              trip.activities.map((day, dayIndex) => (
                <div key={dayIndex} className="card-travel p-6 animate-slide-up" style={{ animationDelay: `${dayIndex * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Day {day.day} - {day.city}</h2>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Activity
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">{activity.time}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-foreground">{activity.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>${activity.cost}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="card-travel p-12 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-sky-light flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No activities planned yet</h3>
                <p className="text-muted-foreground mb-6">Start adding activities to build your itinerary</p>
                <Button variant="accent" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Add First Activity
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Itinerary;
