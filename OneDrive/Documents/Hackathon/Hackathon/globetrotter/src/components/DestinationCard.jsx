import { MapPin, Star, Calendar, Map } from "lucide-react";

export const DestinationCard = ({
  name,
  country,
  imageUrl,
  rating,
  attractions,
  bestTime,
  description,
}) => {
  return (
    <div className="card-travel group cursor-pointer">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{name}</h3>
          <div className="flex items-center gap-1 text-white/95 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{country}</span>
          </div>
          <p className="text-sm text-white/90 line-clamp-2 drop-shadow-md">{description}</p>
        </div>
      </div>

      {/* Additional Information */}
      <div className="p-4 space-y-3">
        {/* Attractions */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Map className="w-4 h-4" />
          <span className="text-sm">{attractions} attractions</span>
        </div>

        {/* Best Time to Visit */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Best: {bestTime}</span>
        </div>
      </div>
    </div>
  );
};
