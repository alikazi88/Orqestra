import { MapPin, Users, Heart, Sparkles, Star } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

interface Venue {
    id: string;
    name: string;
    city: string;
    capacity: number;
    tier: string;
    photos: string[];
    aiMatchScore: number;
    pricing_min: number;
}

export const VenueCard = ({ venue }: { venue: Venue }) => {
    return (
        <Card glass className="p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500 border-white/20">
            <div className="relative h-56 overflow-hidden">
                <img
                    src={venue.photos[0] || `https://picsum.photos/seed/${venue.id}/800/600`}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="info" className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        {venue.tier} Tier
                    </Badge>
                </div>

                <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all">
                    <Heart className="h-5 w-5" />
                </button>

                {/* AI Match Score Badge */}
                <div className="absolute -bottom-4 right-6 h-12 px-4 rounded-2xl bg-primary flex items-center gap-2 shadow-xl shadow-primary/40 animate-in zoom-in-50 duration-500">
                    <Sparkles className="h-4 w-4 text-white animate-pulse" />
                    <span className="text-white font-black text-lg">{venue.aiMatchScore}%</span>
                    <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest ml-1">AI Match</span>
                </div>
            </div>

            <div className="p-6 pt-8">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-extrabold tracking-tight group-hover:text-primary transition-colors">{venue.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-bold">4.9</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground text-xs mb-6">
                    <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5" />
                        {venue.city}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Users className="h-3.5 w-3.5" />
                        Up to {venue.capacity}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Starts at</p>
                        <p className="text-lg font-black text-foreground">₹{venue.pricing_min.toLocaleString()}<span className="text-xs font-medium text-muted-foreground">/day</span></p>
                    </div>
                    <button className="h-10 px-6 rounded-xl bg-muted font-bold text-xs hover:bg-foreground hover:text-white transition-all">
                        View Details
                    </button>
                </div>
            </div>
        </Card>
    );
};
