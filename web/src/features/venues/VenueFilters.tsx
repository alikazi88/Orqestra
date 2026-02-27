import { Search, MapPin, Layers, Users, SlidersHorizontal } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

export const VenueFilters = () => {
    return (
        <div className="space-y-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search Venues, Cities, or Amenities..."
                    className="w-full bg-white border border-border h-14 pl-12 pr-6 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
            </div>

            <Card className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <h4 className="font-extrabold flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        Advanced Filters
                    </h4>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Reset All</button>
                </div>

                {/* City Filter */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        Host City
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Mumbai', 'Delhi', 'Bangalore', 'Goa'].map((city) => (
                            <button
                                key={city}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-primary hover:text-white transition-all border border-transparent"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tier Filter */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Layers className="h-3 w-3" />
                        Venue Tiering
                    </label>
                    <div className="space-y-2">
                        {[
                            { label: 'Tier 1A - Landmark/Royal', id: '1a' },
                            { label: 'Tier 1B - High-End/Corporate', id: '1b' },
                            { label: 'Tier 2 - Boutique/Casual', id: '2' },
                        ].map((tier) => (
                            <div key={tier.id} className="flex items-center gap-3 group cursor-pointer">
                                <div className="h-5 w-5 rounded-md border-2 border-border group-hover:border-primary transition-colors" />
                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{tier.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Capacity Filter */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        Minimum Capacity
                    </label>
                    <div className="pt-2">
                        <div className="h-1.5 w-full bg-muted rounded-full relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-2/3 bg-primary" />
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] font-bold">
                            <span>0</span>
                            <span>5000+</span>
                        </div>
                    </div>
                </div>

                <button className="w-full h-12 bg-foreground text-white rounded-xl font-bold text-xs hover:shadow-lg transition-all active:scale-[0.98]">
                    Apply Filter Discovery
                </button>
            </Card>
        </div>
    );
};
