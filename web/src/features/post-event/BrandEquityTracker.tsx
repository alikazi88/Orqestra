import { useState } from 'react';
import {
    Brain, TrendingUp, Calendar,
    Star, Users, BarChart3
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface EventMemory {
    eventName: string;
    date: string;
    nps: number;
    attendance: number;
    budgetVariance: number;
    topInsight: string;
}

export const BrandEquityTracker = () => {
    const [memories] = useState<EventMemory[]>([
        { eventName: 'Annual Gala 2025', date: '2025-11-15', nps: 78, attendance: 450, budgetVariance: -5.2, topInsight: 'Venue selection drove highest satisfaction' },
        { eventName: 'Product Launch Q4', date: '2025-10-02', nps: 65, attendance: 280, budgetVariance: 2.1, topInsight: 'AV quality needs improvement for tech events' },
        { eventName: 'Team Offsite Goa', date: '2025-08-20', nps: 84, attendance: 120, budgetVariance: -8.0, topInsight: 'Outdoor activities scored highest in feedback' },
        { eventName: 'Client Summit', date: '2025-06-10', nps: 71, attendance: 350, budgetVariance: 1.5, topInsight: 'Panel discussions preferred over keynotes' },
        { eventName: 'Founder\'s Day', date: '2025-03-15', nps: 88, attendance: 600, budgetVariance: -3.8, topInsight: 'Nostalgia-themed décor resonated deeply' },
    ]);

    const avgNPS = memories.length > 0 ? Math.round(memories.reduce((s, m) => s + m.nps, 0) / memories.length) : 0;
    const totalAttendees = memories.reduce((s, m) => s + m.attendance, 0);
    const npsTrend = memories.length > 1 ? memories[0].nps - memories[memories.length - 1].nps : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <Brain className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Brand Equity Tracker</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Longitudinal workspace memory</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Events</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">{memories.length}</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Avg NPS</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">{avgNPS}</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Attendees</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">{totalAttendees.toLocaleString()}</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">NPS Trend</span>
                    </div>
                    <span className={cn("text-3xl font-black tracking-tighter italic", npsTrend >= 0 ? "text-accent-green" : "text-accent-pink")}>
                        {npsTrend >= 0 ? '+' : ''}{npsTrend}
                    </span>
                </div>
            </div>

            {/* NPS Chart */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> NPS Over Time
                </h3>
                <div className="flex items-end gap-4 h-[160px]">
                    {[...memories].reverse().map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-[9px] font-black">{m.nps}</span>
                            <div
                                className={cn(
                                    "w-full rounded-t-xl transition-all",
                                    m.nps >= 80 ? "bg-accent-green" : m.nps >= 60 ? "bg-accent-blue" : "bg-accent-yellow"
                                )}
                                style={{ height: `${(m.nps / 100) * 140}px` }}
                            />
                            <span className="text-[8px] font-bold text-muted-foreground text-center leading-tight">
                                {m.eventName.split(' ').slice(0, 2).join(' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Memory Timeline */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6">Event Memory</h3>
                <div className="space-y-4">
                    {memories.map((m, i) => (
                        <div key={i} className="flex items-start gap-4 pb-4 border-b border-border/5 last:border-0 last:pb-0">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-black text-primary">{m.nps}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black tracking-tight">{m.eventName}</h4>
                                <p className="text-[10px] font-bold text-muted-foreground">{new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {m.attendance} attendees</p>
                                <p className="text-[10px] font-medium text-primary/70 mt-1 italic">💡 {m.topInsight}</p>
                            </div>
                            <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-full",
                                m.budgetVariance <= 0 ? "bg-accent-green/10 text-accent-green" : "bg-accent-pink/10 text-accent-pink"
                            )}>
                                {m.budgetVariance <= 0 ? '' : '+'}{m.budgetVariance}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
