import {
    TrendingUp, Palette, BarChart3,
    ArrowUp, ArrowDown
} from 'lucide-react';

interface TrendItem {
    name: string;
    category: string;
    usageThisMonth: number;
    usageLastMonth: number;
    trend: 'rising' | 'falling' | 'stable';
    popularIn: string[];
}

const TRENDS: TrendItem[] = [
    { name: 'Dried Pampas Grass', category: 'Florals', usageThisMonth: 84, usageLastMonth: 62, trend: 'rising', popularIn: ['Mumbai', 'Bangalore', 'Delhi'] },
    { name: 'Neon Light Signage', category: 'Lighting', usageThisMonth: 72, usageLastMonth: 55, trend: 'rising', popularIn: ['Mumbai', 'Goa', 'Pune'] },
    { name: 'Rattan & Cane Furniture', category: 'Furniture', usageThisMonth: 65, usageLastMonth: 48, trend: 'rising', popularIn: ['Goa', 'Bangalore', 'Jaipur'] },
    { name: 'Sequin/Mirror Backdrop', category: 'Backdrops', usageThisMonth: 58, usageLastMonth: 67, trend: 'falling', popularIn: ['Delhi', 'Hyderabad'] },
    { name: 'Macramé Hangings', category: 'Decor', usageThisMonth: 54, usageLastMonth: 51, trend: 'stable', popularIn: ['Mumbai', 'Goa'] },
    { name: 'Terracotta Pottery', category: 'Table', usageThisMonth: 49, usageLastMonth: 32, trend: 'rising', popularIn: ['Jaipur', 'Udaipur', 'Delhi'] },
    { name: 'Balloon Installations', category: 'Decor', usageThisMonth: 45, usageLastMonth: 61, trend: 'falling', popularIn: ['Mumbai', 'Hyderabad'] },
    { name: 'Crystal Chandelier Rentals', category: 'Lighting', usageThisMonth: 42, usageLastMonth: 40, trend: 'stable', popularIn: ['Delhi', 'Mumbai', 'Udaipur'] },
    { name: 'Brass Urlis & Floating Candles', category: 'Table', usageThisMonth: 68, usageLastMonth: 45, trend: 'rising', popularIn: ['Chennai', 'Hyderabad', 'Kochi'] },
    { name: 'Living Moss Walls', category: 'Backdrops', usageThisMonth: 38, usageLastMonth: 22, trend: 'rising', popularIn: ['Bangalore', 'Mumbai'] },
];

export const DecorTrendEngine = () => {
    const rising = TRENDS.filter(t => t.trend === 'rising');
    const falling = TRENDS.filter(t => t.trend === 'falling');

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-accent-pink via-purple-500 to-accent-blue rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Décor Trend Engine</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Monthly usage data from real events</p>
                </div>
            </div>

            {/* Rising Trends */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-accent-green" /> Trending Up
                </h3>
                <div className="space-y-4">
                    {rising.sort((a, b) => b.usageThisMonth - a.usageThisMonth).map(item => {
                        const growth = Math.round(((item.usageThisMonth - item.usageLastMonth) / item.usageLastMonth) * 100);
                        return (
                            <div key={item.name} className="flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black tracking-tight">{item.name}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-muted">{item.category}</span>
                                    </div>
                                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-accent-green to-emerald-400 rounded-full" style={{ width: `${item.usageThisMonth}%` }} />
                                    </div>
                                </div>
                                <span className="text-accent-green text-xs font-black flex items-center gap-0.5 w-14 justify-end">
                                    <ArrowUp className="h-2.5 w-2.5" /> {growth}%
                                </span>
                                <span className="text-[9px] font-bold text-muted-foreground w-28 text-right">{item.popularIn.slice(0, 2).join(', ')}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Declining */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-accent-pink" /> Trending Down
                </h3>
                <div className="space-y-4">
                    {falling.map(item => {
                        const decline = Math.round(((item.usageLastMonth - item.usageThisMonth) / item.usageLastMonth) * 100);
                        return (
                            <div key={item.name} className="flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black tracking-tight">{item.name}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-muted">{item.category}</span>
                                    </div>
                                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-accent-pink to-red-400 rounded-full" style={{ width: `${item.usageThisMonth}%` }} />
                                    </div>
                                </div>
                                <span className="text-accent-pink text-xs font-black flex items-center gap-0.5 w-14 justify-end">
                                    <ArrowDown className="h-2.5 w-2.5" /> {decline}%
                                </span>
                                <span className="text-[9px] font-bold text-muted-foreground w-28 text-right">{item.popularIn.join(', ')}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Category Heatmap */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> Category Popularity
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[...new Set(TRENDS.map(t => t.category))].map(cat => {
                        const catItems = TRENDS.filter(t => t.category === cat);
                        const avgUsage = Math.round(catItems.reduce((s, i) => s + i.usageThisMonth, 0) / catItems.length);
                        return (
                            <div key={cat} className="text-center p-4 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/5">
                                <Palette className="h-5 w-5 mx-auto mb-2 opacity-30" />
                                <span className="text-[10px] font-black uppercase tracking-widest block">{cat}</span>
                                <span className="text-lg font-black tracking-tighter italic text-primary">{avgUsage}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
