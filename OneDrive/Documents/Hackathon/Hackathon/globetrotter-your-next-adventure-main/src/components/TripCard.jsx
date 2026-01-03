import { Calendar, MapPin, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const TripCard = ({
  id,
  name,
  startDate,
  endDate,
  destinations,
  imageUrl,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card-travel group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-primary-foreground line-clamp-1">{name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {startDate} - {endDate}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-5">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{destinations} destinations</span>
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
