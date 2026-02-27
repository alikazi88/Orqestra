import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
    ChevronLeft,
    Star,
    MapPin,
    Users,
    Heart,
    Sparkles,
    Info,
    Check,
    Calendar,
    ArrowRight,
    Camera,
    Shield,
    Wifi,
    Car,
    Music,
    Utensils,
    Layers
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { VenueTourModal } from './VenueTourModal';

interface VenueDetailProps {
    venueId: string;
    onBack: () => void;
    onOpenLayoutStudio?: () => void;
}

// Full mock data for the selected venue (extending the basic discovery mock)
const VENUE_DATA = {
    id: 'v1',
    name: 'The Royal Ballroom',
    city: 'Mumbai',
    area: 'Worli',
    capacity: 1200,
    tier: '1A',
    rating: 4.9,
    reviews: 128,
    photos: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
    ],
    aiMatchScore: 98,
    pricing_min: 250000,
    description: "The Royal Ballroom is Mumbai's most prestigious venue, offering a blend of colonial architecture and modern luxury. Spanning 15,000 sq. ft., it's ideal for large-scale corporate summits and high-profile social gatherings.",
    amenities: [
        { name: 'Valet Parking', icon: Car },
        { name: 'High-speed Wi-Fi', icon: Wifi },
        { name: 'In-house AV', icon: Music },
        { name: 'Premium Catering', icon: Utensils },
        { name: 'Security NOC', icon: Shield },
        { name: '360° Cam Access', icon: Camera }
    ],
    aiMatchReasons: [
        "Capacity is perfect for your 1000+ guest blueprint.",
        "Tier 1A status aligns with your premium brand positioning.",
        "In-house AV saves ₹85,000 on external vendor costs.",
        "Historical booking data shows 100% completion rate for your event type."
    ]
};

export const VenueDetail = ({ venueId, onBack, onOpenLayoutStudio }: VenueDetailProps) => {
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    const [isTourModalOpen, setIsTourModalOpen] = useState(false);
    const [tourType, setTourType] = useState<'virtual' | 'physical'>('virtual');

    const venue = VENUE_DATA;

    useEffect(() => {
        // Pre-fetch logic or tracking could go here
        console.log(`VenueDetail mounted for ID: ${venueId}`);
    }, [venueId]);

    const handleRequestTour = (type: 'virtual' | 'physical') => {
        setTourType(type);
        setIsTourModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
                >
                    <div className="h-10 w-10 rounded-xl border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                        <ChevronLeft className="h-5 w-5" />
                    </div>
                    Back to Discovery
                </button>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-border/60 font-bold h-10 px-5">
                        <Heart className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button className="rounded-xl font-bold h-10 px-8 shadow-lg shadow-primary/20">
                        Select Venue
                    </Button>
                </div>
            </div>

            {/* Immersive Gallery Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
                <div className="lg:col-span-8 relative rounded-[32px] overflow-hidden group shadow-2xl">
                    <img
                        src={venue.photos[selectedPhoto]}
                        alt={venue.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-10 left-10 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant="info" className="bg-primary border-transparent text-white font-black tracking-widest text-[10px] px-3 py-1">
                                {venue.tier} TIER
                            </Badge>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold">
                                <MapPin className="h-3 w-3" /> {venue.area}, {venue.city}
                            </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">{venue.name}</h1>
                        <div className="flex items-center gap-4 text-sm font-bold text-white/80">
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-500 fill-current" /> {venue.rating} ({venue.reviews} Reviews)</span>
                            <span className="h-1 w-1 rounded-full bg-white/40" />
                            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Up to {venue.capacity} Pax</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 grid grid-cols-1 gap-4 overflow-hidden">
                    {venue.photos.map((photo, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedPhoto(i)}
                            className={cn(
                                "relative rounded-3xl overflow-hidden transition-all duration-300 border-2",
                                selectedPhoto === i ? "border-primary opacity-100 scale-[0.98]" : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"
                            )}
                        >
                            <img src={photo} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                {/* Left Side: Info & Amenities */}
                <div className="lg:col-span-8 space-y-10">
                    <section>
                        <h2 className="text-2xl font-black tracking-tight mb-4">About the Venue</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                            {venue.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black tracking-tight mb-6">Premium Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {venue.amenities.map((item, i) => (
                                <Card key={i} className="p-5 flex items-center gap-4 border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                                    <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <span className="font-bold text-sm">{item.name}</span>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Interactive CTAs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <Card className="p-8 bg-foreground text-white border-0 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <Camera className="h-24 w-24" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Immersive Walkthrough</h3>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">Experience the venue in high-definition 360° before you visit.</p>
                            <Button
                                onClick={() => handleRequestTour('virtual')}
                                className="bg-white text-foreground hover:bg-white/90 rounded-xl font-black w-full h-12"
                            >
                                Request Virtual Tour
                            </Button>
                        </Card>
                        <Card className="p-8 border-2 border-primary/20 bg-primary/5 relative overflow-hidden group">
                            <h3 className="text-xl font-bold mb-3">Site Inspection</h3>
                            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Coordinate with our team to visit the venue in person.</p>
                            <Button
                                onClick={() => handleRequestTour('physical')}
                                className="bg-primary text-white hover:bg-primary/90 rounded-xl font-black w-full h-12 shadow-xl shadow-primary/20"
                            >
                                Schedule Site Visit
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Right Side: AI Match & Pricing */}
                <div className="lg:col-span-4 space-y-6">
                    {/* AI Match Card */}
                    <Card className="p-8 border-primary/30 shadow-2xl shadow-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                            <Sparkles className="h-32 w-32" />
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-16 w-16 rounded-2xl bg-primary flex flex-col items-center justify-center text-white shadow-xl shadow-primary/20">
                                <span className="text-2xl font-black">{venue.aiMatchScore}%</span>
                            </div>
                            <div>
                                <h4 className="font-black tracking-tight">AI Match Confidence</h4>
                                <p className="text-[10px] uppercase tracking-widest font-black text-primary">Highly Recommended</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {venue.aiMatchReasons.map((reason, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="h-5 w-5 min-w-[20px] rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                        <Check className="h-3 w-3 text-primary" />
                                    </div>
                                    <p className="text-xs font-bold text-muted-foreground leading-relaxed">{reason}</p>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-black border-border/60 group">
                            View Matching Logic
                            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>

                    {/* Quick Stats Card */}
                    <Card className="p-8">
                        <h4 className="font-bold text-lg mb-6">Pricing Summary</h4>
                        <div className="space-y-6 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-muted-foreground">Off-Peak Rate</span>
                                </div>
                                <span className="text-sm font-black text-foreground">₹{venue.pricing_min.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Info className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-bold text-muted-foreground">Service Charge</span>
                                </div>
                                <span className="text-sm font-black text-foreground">18% (GST)</span>
                            </div>
                        </div>
                        <div className="h-px bg-border mb-6" />
                        <div className="flex items-center justify-between mb-8">
                            <span className="font-black text-xl">Total Est.</span>
                            <span className="font-black text-2xl text-primary">₹{(venue.pricing_min * 1.18).toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button className="w-full h-14 rounded-2xl text-sm font-black shadow-2xl shadow-primary/20">
                                Book This Venue
                            </Button>
                            <Button
                                onClick={onOpenLayoutStudio}
                                variant="outline"
                                className="w-full h-12 rounded-xl text-xs font-black border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                            >
                                <Layers className="mr-2 h-4 w-4" /> Launch Layout Studio
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <VenueTourModal
                isOpen={isTourModalOpen}
                onClose={() => setIsTourModalOpen(false)}
                venue={{
                    id: venue.id,
                    name: venue.name,
                    city: venue.city
                }}
                initialType={tourType}
            />
        </div>
    );
};
