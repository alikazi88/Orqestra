import { VenueCard } from './VenueCard';
import { VenueFilters } from './VenueFilters';
import { Badge } from '../../components/ui/Badge';
import { Sparkles, MapPin, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { VenueDetail } from './VenueDetail';
import { VenueLayoutStudio } from './layout/VenueLayoutStudio';

const MOCK_VENUES = [
    {
        id: 'v1',
        name: 'The Royal Ballroom',
        city: 'Mumbai',
        capacity: 1200,
        tier: '1A',
        photos: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'],
        aiMatchScore: 98,
        pricing_min: 250000,
    },
    {
        id: 'v2',
        name: 'TechHub Conference Center',
        city: 'Bangalore',
        capacity: 500,
        tier: '1B',
        photos: ['https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800'],
        aiMatchScore: 85,
        pricing_min: 150000,
    },
    {
        id: 'v3',
        name: 'Goa Beachfront Pavilion',
        city: 'Goa',
        capacity: 300,
        tier: '2',
        photos: ['https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800'],
        aiMatchScore: 92,
        pricing_min: 180000,
    },
    {
        id: 'v4',
        name: 'Heritage Palace Grounds',
        city: 'Delhi',
        capacity: 3000,
        tier: '1A',
        photos: ['https://images.unsplash.com/photo-1549412650-ef3fa2444605?auto=format&fit=crop&q=80&w=800'],
        aiMatchScore: 78,
        pricing_min: 450000,
    },
];

export const VenueDiscovery = () => {
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
    const [isLayoutStudioOpen, setIsLayoutStudioOpen] = useState(false);

    if (isLayoutStudioOpen && selectedVenueId) {
        return <VenueLayoutStudio venueId={selectedVenueId} onBack={() => setIsLayoutStudioOpen(false)} />;
    }

    if (selectedVenueId) {
        return (
            <VenueDetail
                venueId={selectedVenueId}
                onBack={() => setSelectedVenueId(null)}
                onOpenLayoutStudio={() => setIsLayoutStudioOpen(true)}
            />
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-4xl font-black tracking-tight text-foreground">Venue Discovery</h1>
                            <Badge variant="info" className="h-6 px-3 bg-primary/10 text-primary border-primary/20 font-bold">
                                Beta
                            </Badge>
                        </div>
                    </div>
                    <p className="text-muted-foreground font-medium text-lg lg:max-w-xl">
                        Explore 500+ premium venues with Orqestra's AI-driven matching.
                        Optimized for Tier 1A, 1B, and 2 markets across India.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-2xl border border-border">
                    <div className="h-10 px-4 flex items-center gap-2 text-primary font-bold text-sm">
                        <Sparkles className="h-4 w-4" />
                        Smart Matching Active
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <button className="h-10 px-6 bg-white rounded-xl text-xs font-black shadow-sm border border-border hover:shadow-md transition-all flex items-center gap-2">
                        All Cities <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                {/* Left Sidebar Filters */}
                <aside className="lg:col-span-3">
                    <VenueFilters />
                </aside>

                {/* Venue Grid */}
                <div className="lg:col-span-9">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-3">
                            Top Matches For You
                            <span className="text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">42 Found</span>
                        </h2>
                        <div className="flex gap-2">
                            {['Recommended', 'Capacity', 'Pricing'].map((sort) => (
                                <button
                                    key={sort}
                                    className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-muted transition-all"
                                >
                                    {sort}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {MOCK_VENUES.map((venue) => (
                            <VenueCard
                                key={venue.id}
                                venue={venue}
                                onViewDetails={setSelectedVenueId}
                            />
                        ))}
                    </div>

                    {/* Load More/Placeholder */}
                    <div className="mt-12 p-8 rounded-[40px] border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 bg-muted/5 group cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-all text-muted-foreground group-hover:text-primary">
                            <Search className="h-6 w-6" />
                        </div>
                        <p className="font-bold text-muted-foreground group-hover:text-primary transition-colors">Explore more venues in Mumbai and beyond</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
