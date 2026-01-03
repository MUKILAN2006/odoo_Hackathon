import { MapPin, Star } from "lucide-react";

export const DestinationCard = ({
  name,
  country,
  imageUrl,
  rating,
}) => {
  return (
    <div className="card-travel group cursor-pointer">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-primary-foreground mb-1">{name}</h3>
          <div className="flex items-center gap-1 text-primary-foreground/80">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{country}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
