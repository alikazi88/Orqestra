import {
    MapPin,
    ArrowDown, ArrowUp, BarChart3
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface CityBenchmark {
    city: string;
    tier: '1A' | '1B' | '2';
    venue: number;
    catering: number;
    decor: number;
    photography: number;
    entertainment: number;
}

const BENCHMARKS: CityBenchmark[] = [
    { city: 'Mumbai', tier: '1A', venue: 500000, catering: 180000, decor: 120000, photography: 80000, entertainment: 100000 },
    { city: 'Delhi', tier: '1A', venue: 475000, catering: 170000, decor: 115000, photography: 75000, entertainment: 95000 },
    { city: 'Bangalore', tier: '1A', venue: 450000, catering: 160000, decor: 110000, photography: 70000, entertainment: 85000 },
    { city: 'Hyderabad', tier: '1B', venue: 350000, catering: 130000, decor: 85000, photography: 55000, entertainment: 65000 },
    { city: 'Pune', tier: '1B', venue: 320000, catering: 120000, decor: 80000, photography: 50000, entertainment: 60000 },
    { city: 'Chennai', tier: '1B', venue: 340000, catering: 125000, decor: 82000, photography: 52000, entertainment: 62000 },
    { city: 'Kolkata', tier: '1B', venue: 300000, catering: 110000, decor: 75000, photography: 45000, entertainment: 55000 },
    { city: 'Jaipur', tier: '2', venue: 250000, catering: 90000, decor: 60000, photography: 35000, entertainment: 40000 },
    { city: 'Goa', tier: '2', venue: 280000, catering: 100000, decor: 70000, photography: 40000, entertainment: 50000 },
    { city: 'Lucknow', tier: '2', venue: 200000, catering: 80000, decor: 50000, photography: 30000, entertainment: 35000 },
    { city: 'Udaipur', tier: '2', venue: 350000, catering: 95000, decor: 65000, photography: 38000, entertainment: 45000 },
    { city: 'Chandigarh', tier: '2', venue: 240000, catering: 85000, decor: 55000, photography: 32000, entertainment: 38000 },
];

const TIER_COLORS = {
    '1A': 'bg-accent-pink/10 text-accent-pink',
    '1B': 'bg-accent-blue/10 text-accent-blue',
    '2': 'bg-accent-green/10 text-accent-green',
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const getTotal = (b: CityBenchmark) => b.venue + b.catering + b.decor + b.photography + b.entertainment;

export const MultiCityBenchmarks = () => {
    const mumbaiTotal = getTotal(BENCHMARKS[0]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-accent-blue to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <MapPin className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Multi-City Benchmarks</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Tier 1A · 1B · 2 pricing comparison</p>
                </div>
            </div>

            {/* Tier Legend */}
            <div className="flex items-center gap-4">
                {(['1A', '1B', '2'] as const).map(tier => (
                    <div key={tier} className="flex items-center gap-2">
                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", TIER_COLORS[tier])}>
                            Tier {tier}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground">
                            {tier === '1A' ? 'Metro' : tier === '1B' ? 'Major City' : 'Emerging'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Bar Chart Comparison */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> Total Event Cost (500-pax benchmark)
                </h3>
                <div className="space-y-3">
                    {BENCHMARKS.map(b => {
                        const total = getTotal(b);
                        const pct = (total / mumbaiTotal) * 100;
                        const diff = total - mumbaiTotal;
                        return (
                            <div key={b.city} className="flex items-center gap-4">
                                <span className="text-xs font-bold w-24 text-right">{b.city}</span>
                                <span className={cn("text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full w-12 text-center", TIER_COLORS[b.tier])}>
                                    {b.tier}
                                </span>
                                <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all",
                                            b.tier === '1A' ? 'bg-accent-pink/60' : b.tier === '1B' ? 'bg-accent-blue/60' : 'bg-accent-green/60'
                                        )}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-xs font-black w-20 text-right">{formatCurrency(total)}</span>
                                <span className={cn("text-[9px] font-bold w-14 text-right flex items-center justify-end gap-0.5",
                                    diff <= 0 ? 'text-accent-green' : 'text-accent-pink'
                                )}>
                                    {diff <= 0 ? <ArrowDown className="h-2.5 w-2.5" /> : <ArrowUp className="h-2.5 w-2.5" />}
                                    {Math.abs(Math.round((diff / mumbaiTotal) * 100))}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Table */}
            <div className="intelly-card p-8 overflow-x-auto">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6">Category Breakdown</h3>
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-border/10">
                            <th className="text-left py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">City</th>
                            <th className="text-left py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Tier</th>
                            <th className="text-right py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Venue</th>
                            <th className="text-right py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Catering</th>
                            <th className="text-right py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Décor</th>
                            <th className="text-right py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Photo</th>
                            <th className="text-right py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Entertain</th>
                            <th className="text-right py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {BENCHMARKS.map(b => (
                            <tr key={b.city} className="border-b border-border/5 hover:bg-muted/20 transition-colors">
                                <td className="py-2.5 font-bold">{b.city}</td>
                                <td className="py-2.5"><span className={cn("text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full", TIER_COLORS[b.tier])}>{b.tier}</span></td>
                                <td className="py-2.5 text-right font-medium">{formatCurrency(b.venue)}</td>
                                <td className="py-2.5 text-right font-medium">{formatCurrency(b.catering)}</td>
                                <td className="py-2.5 text-right font-medium">{formatCurrency(b.decor)}</td>
                                <td className="py-2.5 text-right font-medium">{formatCurrency(b.photography)}</td>
                                <td className="py-2.5 text-right font-medium">{formatCurrency(b.entertainment)}</td>
                                <td className="py-2.5 text-right font-black">{formatCurrency(getTotal(b))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
