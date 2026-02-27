import { MapPin, Star, ShieldCheck, Heart, Sparkles, MessageSquare, BarChart3, Check } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

interface Vendor {
    id: string;
    name: string;
    category: string;
    city: string;
    tier: string;
    photos: string[];
    riskScore: number;
    verified: boolean;
    pricing_min: number;
}

interface VendorCardProps {
    vendor: Vendor;
    onRFQ: (vendor: Vendor) => void;
    isSelected?: boolean;
    onToggleCompare?: (vendor: Vendor) => void;
}

export const VendorCard = ({ vendor, onRFQ, isSelected, onToggleCompare }: VendorCardProps) => {
    return (
        <Card glass className={cn(
            "p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500 border-white/20",
            isSelected && "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-2xl"
        )}>
            <div className="relative h-48 overflow-hidden">
                <img
                    src={vendor.photos[0] || `https://picsum.photos/seed/${vendor.id}/800/600`}
                    alt={vendor.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="info" className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        {vendor.category}
                    </Badge>
                    {vendor.verified && (
                        <Badge variant="success" className="bg-primary/20 backdrop-blur-md border-primary/40 text-primary-foreground flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                    )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all">
                        <Heart className="h-5 w-5" />
                    </button>
                    {onToggleCompare && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleCompare(vendor);
                            }}
                            className={cn(
                                "h-10 w-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all",
                                isSelected
                                    ? "bg-primary border-primary text-white scale-110 shadow-lg"
                                    : "bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
                            )}
                        >
                            {isSelected ? <Check className="h-5 w-5 stroke-[3]" /> : <BarChart3 className="h-5 w-5" />}
                        </button>
                    )}
                </div>

                {/* Risk Score Indicator */}
                <div className={cn(
                    "absolute -bottom-4 right-6 h-12 px-4 rounded-2xl flex items-center gap-2 shadow-xl animate-in zoom-in-50 duration-500",
                    vendor.riskScore > 80 ? "bg-green-500 shadow-green-500/40" : "bg-amber-500 shadow-amber-500/40"
                )}>
                    <Badge variant="info" className="bg-white/20 border-white/20 text-white font-black text-lg p-0 h-auto bg-transparent border-0">{vendor.riskScore}%</Badge>
                    <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest ml-1 leading-none">Trust<br />Score</span>
                </div>
            </div>

            <div className="p-6 pt-10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-extrabold tracking-tight group-hover:text-primary transition-colors">{vendor.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-bold">4.8</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground text-xs mb-6">
                    <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5" />
                        {vendor.city}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        {vendor.tier} Tier
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Base Pkg</p>
                        <p className="text-lg font-black text-foreground">₹{vendor.pricing_min.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => onRFQ(vendor)}
                        className="h-10 px-5 rounded-xl bg-primary text-white font-bold text-xs hover:shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Request RFQ
                    </button>
                </div>
            </div>
        </Card>
    );
};
