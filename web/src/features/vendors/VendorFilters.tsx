import { Search, Layers, SlidersHorizontal, ShieldCheck, X, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

interface VendorFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    category: string | null;
    onCategoryChange: (cat: string | null) => void;
    selectedTiers: string[];
    onTierChange: (tier: string) => void;
    onReset: () => void;
}

export const VendorFilters = ({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    selectedTiers,
    onTierChange,
    onReset
}: VendorFiltersProps) => {
    return (
        <div className="space-y-6">
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search Decor, F&B, Tech..."
                    className="w-full bg-white border border-border h-14 pl-12 pr-6 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                />
            </div>

            <Card className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <h4 className="font-extrabold flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        Intelligence Filters
                    </h4>
                    <button
                        onClick={onReset}
                        className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                        <X className="h-3 w-3" /> Reset
                    </button>
                </div>

                {/* Category Filter */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Decor', 'F&B', 'AV & Tech', 'Logistics', 'Security', 'Invitees'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => onCategoryChange(cat === category ? null : cat)}
                                className={cn(
                                    "px-3 py-2 rounded-xl text-[10px] font-bold transition-all border",
                                    cat === category
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-muted hover:bg-muted/80 text-foreground border-transparent"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trust Score Filter */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3" />
                        Trust Score (80+)
                    </label>
                    <div className="pt-2">
                        <div className="h-1.5 w-full bg-muted rounded-full relative">
                            <div className="absolute left-0 right-0 top-0 bottom-0 bg-primary/20 rounded-full" />
                            <div className="absolute left-[60%] right-0 top-0 bottom-0 bg-primary rounded-full transition-all" />
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-muted-foreground">
                            <span>Any</span>
                            <span className="text-primary font-black">Verified Only</span>
                        </div>
                    </div>
                </div>

                {/* Pricing Filter */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Layers className="h-3 w-3" />
                        Vendor Tier
                    </label>
                    <div className="space-y-2">
                        {[
                            { label: 'Royal/Luxury (1A)', id: '1A' },
                            { label: 'Premium/Corporate (1B)', id: '1B' },
                            { label: 'Standard/Boutique (2)', id: '2' },
                        ].map((tier) => (
                            <button
                                key={tier.id}
                                onClick={() => onTierChange(tier.id)}
                                className="flex items-center gap-3 group w-full text-left"
                            >
                                <div className={cn(
                                    "h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center",
                                    selectedTiers.includes(tier.id)
                                        ? "bg-primary border-primary"
                                        : "border-border group-hover:border-primary/50"
                                )}>
                                    {selectedTiers.includes(tier.id) && <Check className="h-3 w-3 text-white stroke-[4]" />}
                                </div>
                                <span className={cn(
                                    "text-sm font-medium transition-colors",
                                    selectedTiers.includes(tier.id) ? "text-primary font-bold" : "text-foreground group-hover:text-primary"
                                )}>
                                    {tier.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};
