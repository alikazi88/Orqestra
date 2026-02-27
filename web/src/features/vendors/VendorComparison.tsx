import { X, Check, ShieldCheck, Zap, IndianRupee, MapPin, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

interface Vendor {
    id: string;
    name: string;
    category: string;
    city: string;
    tier: string;
    riskScore: number;
    verified: boolean;
    pricing_min: number;
    photos: string[];
}

interface VendorComparisonProps {
    vendors: Vendor[];
    onClose: () => void;
    onSelect: (vendorId: string) => void;
}

export const VendorComparison = ({ vendors, onClose, onSelect }: VendorComparisonProps) => {
    if (vendors.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[150] flex flex-col bg-background/95 backdrop-blur-xl animate-in fade-in duration-500">
            {/* Header */}
            <header className="p-8 border-b border-border flex items-center justify-between bg-white/50 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Zap className="h-8 w-8 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground italic uppercase">Vendor Benchmark</h1>
                        <p className="text-muted-foreground font-medium">Side-by-side intelligence for your event blueprint</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="h-14 w-14 flex items-center justify-center rounded-2xl bg-muted hover:bg-muted/80 transition-all border border-border group"
                >
                    <X className="h-6 w-6 text-muted-foreground group-hover:scale-110 transition-transform" />
                </button>
            </header>

            {/* Comparison Grid */}
            <div className="flex-1 overflow-auto p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <div className={cn(
                        "grid gap-8",
                        vendors.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" :
                            vendors.length === 2 ? "grid-cols-2" : "grid-cols-3"
                    )}>
                        {vendors.map((vendor) => (
                            <div key={vendor.id} className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                                {/* Vendor Cover */}
                                <Card glass className="p-0 overflow-hidden border-white/20 shadow-2xl">
                                    <div className="relative h-64">
                                        <img
                                            src={vendor.photos[0]}
                                            alt={vendor.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{vendor.name}</h2>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge className="bg-white/20 text-white border-0 backdrop-blur-md">{vendor.category}</Badge>
                                                <Badge className="bg-primary text-white border-0 shadow-lg shadow-primary/20">{vendor.tier} Tier</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-10">
                                        {/* Trust Metric */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    Trust IQ
                                                </span>
                                                <span className={cn(
                                                    "text-lg font-black",
                                                    vendor.riskScore > 90 ? "text-green-500" : "text-amber-500"
                                                )}>{vendor.riskScore}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        vendor.riskScore > 90 ? "bg-green-500" : "bg-amber-500"
                                                    )}
                                                    style={{ width: `${vendor.riskScore}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Financials */}
                                        <div className="space-y-4">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <IndianRupee className="h-3 w-3" />
                                                Pricing Benchmark
                                            </span>
                                            <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                                                <div className="text-sm font-medium text-muted-foreground">Internal Estimate From</div>
                                                <div className="text-2xl font-black text-foreground">₹{vendor.pricing_min.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>

                                        {/* AI Match Highlights */}
                                        <div className="space-y-4">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 text-primary">
                                                <Zap className="h-3 w-3 fill-primary" />
                                                Match Intelligence
                                            </span>
                                            <ul className="space-y-3">
                                                {[
                                                    { label: 'High Availability (Mon-Thu)', score: 98 },
                                                    { label: 'Technical Rider Match', score: 95 },
                                                    { label: 'Safety Compliance', score: 100 },
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center justify-between text-sm font-medium">
                                                        <span className="text-muted-foreground">{item.label}</span>
                                                        <div className="flex items-center gap-1.5 text-primary">
                                                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                                                            {item.score}%
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            Active in {vendor.city} Hub
                                        </div>

                                        <Button
                                            className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-wider group bg-primary text-white shadow-xl shadow-primary/20"
                                            onClick={() => onSelect(vendor.id)}
                                        >
                                            Secure & Execute Agreement
                                            <FileText className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Guard */}
            {vendors.length < 3 && (
                <div className="p-8 border-t border-border bg-white text-center">
                    <p className="text-sm font-bold text-muted-foreground italic">
                        Select more vendors from the marketplace to perform a deeper benchmark analysis.
                    </p>
                </div>
            )}
        </div>
    );
};
