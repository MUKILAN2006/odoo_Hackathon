import { Calendar, MapPin, Edit, Trash2, Eye, Star, Users, IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const TripCard = ({
  id,
  name,
  startDate,
  endDate,
  destinations,
  imageUrl,
  location,
  rating,
  budget,
  travelers,
  onEdit,
  onDelete,
}) => {
  // Debug data being passed
  console.log('TripCard data:', { id, name, destinations, budget, travelers });

  return (
    <div className="card-travel group cursor-pointer">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-primary-foreground line-clamp-1">{name}</h3>
          {location && (
            <div className="flex items-center gap-1 text-primary-foreground/80">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {startDate} - {endDate}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{destinations} destinations</span>
        </div>

        {/* Additional Details */}
        <div className={`${travelers && budget ? 'grid grid-cols-2' : 'grid grid-cols-1'} gap-3 mb-5`}>
          {travelers && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">{travelers} travelers</span>
            </div>
          )}
          {budget && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="w-4 h-4" />
              <span className="text-sm">{typeof budget === 'number' ? budget.toLocaleString() : budget}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/itinerary/${id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full gap-2">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
