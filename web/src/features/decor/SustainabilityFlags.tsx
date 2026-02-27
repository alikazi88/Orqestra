import { useState } from 'react';
import {
    Leaf, AlertTriangle, CheckCircle2,
    Recycle, TreePine, Droplets, Lightbulb
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface DecorItem {
    id: string;
    name: string;
    category: string;
    material: string;
    sustainabilityScore: 'eco' | 'moderate' | 'caution' | 'warning';
    flags: string[];
    alternatives: string[];
}

const SAMPLE_ITEMS: DecorItem[] = [
    { id: '1', name: 'Balloon Arch', category: 'Entrance', material: 'Latex/Plastic', sustainabilityScore: 'warning', flags: ['Single-use plastic', 'Non-biodegradable', 'Wildlife hazard'], alternatives: ['Paper lanterns', 'Fabric bunting', 'Dried flower arch'] },
    { id: '2', name: 'Foil Curtain Backdrop', category: 'Stage', material: 'Metallic PET', sustainabilityScore: 'caution', flags: ['Non-recyclable', 'Microplastic risk'], alternatives: ['Fabric draping', 'Macramé wall', 'Greenery wall'] },
    { id: '3', name: 'Fresh Flower Centerpieces', category: 'Dining', material: 'Organic', sustainabilityScore: 'moderate', flags: ['Short lifespan', 'Water-intensive farming'], alternatives: ['Potted plants (guest takeaway)', 'Dried flowers', 'Silk arrangements'] },
    { id: '4', name: 'LED String Lights', category: 'Ambient', material: 'Reusable', sustainabilityScore: 'eco', flags: [], alternatives: [] },
    { id: '5', name: 'Thermocol Props', category: 'Photo Booth', material: 'Polystyrene', sustainabilityScore: 'warning', flags: ['Non-biodegradable', 'Toxic if burned', 'Cannot be recycled'], alternatives: ['Cardboard cutouts', 'Wooden props', 'Digital frames'] },
    { id: '6', name: 'Fabric Draping', category: 'Ceiling', material: 'Reusable textile', sustainabilityScore: 'eco', flags: [], alternatives: [] },
    { id: '7', name: 'Confetti Cannons', category: 'Entertainment', material: 'Mixed plastic/paper', sustainabilityScore: 'caution', flags: ['Cleanup intensive', 'Microplastic if metallic'], alternatives: ['Biodegradable confetti', 'Petal toss', 'Bubble machines'] },
    { id: '8', name: 'Bamboo & Rattan Furniture', category: 'Lounge', material: 'Natural', sustainabilityScore: 'eco', flags: [], alternatives: [] },
];

const SCORE_CONFIG = {
    eco: { label: 'Eco-Friendly', icon: TreePine, color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/20' },
    moderate: { label: 'Moderate', icon: Droplets, color: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/20' },
    caution: { label: 'Use Caution', icon: Lightbulb, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/20' },
    warning: { label: 'Avoid/Replace', icon: AlertTriangle, color: 'text-accent-pink', bg: 'bg-accent-pink/10', border: 'border-accent-pink/20' },
};

export const SustainabilityFlags = () => {
    const [items] = useState<DecorItem[]>(SAMPLE_ITEMS);
    const [filter, setFilter] = useState<'all' | 'eco' | 'moderate' | 'caution' | 'warning'>('all');

    const ecoCount = items.filter(i => i.sustainabilityScore === 'eco').length;
    const warningCount = items.filter(i => i.sustainabilityScore === 'warning' || i.sustainabilityScore === 'caution').length;
    const overallScore = items.length > 0 ? Math.round((ecoCount / items.length) * 100) : 0;

    const filtered = filter === 'all' ? items : items.filter(i => i.sustainabilityScore === filter);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-accent-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <Leaf className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Sustainability Audit</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Eco-conscious decor recommendations</p>
                </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-3 gap-6">
                <div className="intelly-card p-6 accent-card-green">
                    <div className="flex items-center gap-2 mb-2">
                        <Recycle className="h-4 w-4 opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Eco Score</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter italic">{overallScore}%</h2>
                    <p className="text-[9px] font-bold opacity-40 mt-1">{ecoCount} of {items.length} items are eco-friendly</p>
                </div>
                <div className="intelly-card p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-accent-green opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Green Items</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter italic text-accent-green">{ecoCount}</h2>
                    <p className="text-[9px] font-bold opacity-40 mt-1">Reusable or biodegradable</p>
                </div>
                <div className="intelly-card p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-accent-pink opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Needs Attention</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter italic text-accent-pink">{warningCount}</h2>
                    <p className="text-[9px] font-bold opacity-40 mt-1">Replaceable with eco options</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/5 w-fit">
                {(['all', 'eco', 'moderate', 'caution', 'warning'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filter === f ? "bg-white shadow-sm text-[#1a1a1a]" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {f === 'all' ? `All (${items.length})` : `${SCORE_CONFIG[f].label} (${items.filter(i => i.sustainabilityScore === f).length})`}
                    </button>
                ))}
            </div>

            {/* Items */}
            <div className="space-y-4">
                {filtered.map(item => {
                    const cfg = SCORE_CONFIG[item.sustainabilityScore];
                    const Icon = cfg.icon;

                    return (
                        <div key={item.id} className={cn("intelly-card p-6 border", cfg.border)}>
                            <div className="flex items-start gap-5">
                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
                                    <Icon className={cn("h-5 w-5", cfg.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-black tracking-tight">{item.name}</h4>
                                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", cfg.bg, cfg.color)}>{cfg.label}</span>
                                        <span className="text-[9px] font-bold text-muted-foreground">{item.category}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground mb-2">Material: {item.material}</p>

                                    {item.flags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {item.flags.map(flag => (
                                                <span key={flag} className="text-[8px] font-black uppercase tracking-widest bg-accent-pink/10 text-accent-pink px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <AlertTriangle className="h-2 w-2" /> {flag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {item.alternatives.length > 0 && (
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-accent-green opacity-70 block mb-1.5">
                                                ♻️ Eco Alternatives:
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.alternatives.map(alt => (
                                                    <span key={alt} className="text-[9px] font-bold bg-accent-green/10 text-accent-green px-2.5 py-1 rounded-lg">
                                                        {alt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
