import {
    BarChart3, Users, Star, TrendingUp,
    Clock, IndianRupee,
    CheckCircle2, AlertTriangle, Award
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ReportProps {
    eventName?: string;
}

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export const PostEventReport = ({ eventName = 'Grand Celebration 2026' }: ReportProps) => {
    // Simulated data — in production, this would come from Supabase queries
    const metrics = {
        totalGuests: 487,
        rsvpYes: 520,
        attendance: 93.7,
        npsScore: 72,
        totalBudget: 2500000,
        actualSpend: 2340000,
        vendorsUsed: 14,
        vendorsOnTime: 12,
        tasksCompleted: 156,
        totalTasks: 162,
        avgRating: 4.6,
    };

    const highlights = [
        { icon: Award, text: 'Décor & ambiance received the highest guest ratings', type: 'success' },
        { icon: TrendingUp, text: 'Event came in ₹1.6L under budget (6.4% savings)', type: 'success' },
        { icon: CheckCircle2, text: '96.3% task completion rate across all departments', type: 'success' },
        { icon: AlertTriangle, text: 'Parking coordination delayed 15% of arrivals by 20+ mins', type: 'warning' },
        { icon: AlertTriangle, text: 'Bar inventory ran short — consider 30% buffer next time', type: 'warning' },
    ];

    const vendorScores = [
        { name: 'Bloom & Co. (Florist)', rating: 4.9, onTime: true, overBudget: false },
        { name: 'SoundWave Productions', rating: 3.8, onTime: true, overBudget: false },
        { name: 'Royal Caterers', rating: 4.7, onTime: true, overBudget: true },
        { name: 'LightCraft Studios', rating: 4.5, onTime: false, overBudget: false },
        { name: 'Elegance Décor', rating: 4.8, onTime: true, overBudget: false },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent-blue rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Post-Event Report</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{eventName}</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={Users} label="Attendance" value={`${metrics.totalGuests}`} subtitle={`${metrics.attendance}% of ${metrics.rsvpYes} RSVPs`} />
                <MetricCard icon={Star} label="NPS Score" value={`${metrics.npsScore}`} subtitle={metrics.npsScore > 50 ? 'Excellent' : 'Good'} accent />
                <MetricCard icon={IndianRupee} label="Budget Variance" value={formatCurrency(metrics.totalBudget - metrics.actualSpend)} subtitle="Under budget ✓" />
                <MetricCard icon={CheckCircle2} label="Task Completion" value={`${((metrics.tasksCompleted / metrics.totalTasks) * 100).toFixed(1)}%`} subtitle={`${metrics.tasksCompleted}/${metrics.totalTasks} tasks`} />
            </div>

            {/* AI Narrative */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> AI-Generated Summary
                </h3>
                <div className="prose prose-sm max-w-none">
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                        <strong>{eventName}</strong> was a resounding success with <strong>{metrics.totalGuests} attendees</strong> (a {metrics.attendance}% turnout rate).
                        The event achieved an <strong>NPS score of {metrics.npsScore}</strong>, placing it in the &quot;Excellent&quot; category.
                        Budget performance was strong — the event came in <strong>{formatCurrency(metrics.totalBudget - metrics.actualSpend)} under budget</strong>,
                        representing a 6.4% saving against the estimated {formatCurrency(metrics.totalBudget)}.
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground mt-3">
                        Operationally, <strong>{metrics.tasksCompleted} of {metrics.totalTasks} tasks</strong> were completed on time.
                        <strong> {metrics.vendorsOnTime} of {metrics.vendorsUsed} vendors</strong> delivered on schedule.
                        Guest feedback highlighted décor and catering as standout performers, while parking coordination and bar inventory were flagged for improvement.
                    </p>
                </div>
            </div>

            {/* Highlights & Flags */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Key Highlights & Flags</h3>
                <div className="space-y-3">
                    {highlights.map((h, i) => {
                        const Icon = h.icon;
                        return (
                            <div key={i} className="flex items-start gap-3">
                                <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", h.type === 'success' ? 'text-accent-green' : 'text-accent-yellow')} />
                                <span className="text-xs font-medium">{h.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vendor Scorecard */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Vendor Performance</h3>
                <div className="space-y-3">
                    {vendorScores.map(v => (
                        <div key={v.name} className="flex items-center gap-4 py-2 border-b border-border/5 last:border-0">
                            <span className="text-xs font-bold flex-1">{v.name}</span>
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-accent-yellow fill-accent-yellow" />
                                <span className="text-xs font-black">{v.rating}</span>
                            </div>
                            <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                v.onTime ? "bg-accent-green/10 text-accent-green" : "bg-accent-pink/10 text-accent-pink"
                            )}>
                                {v.onTime ? 'On Time' : 'Delayed'}
                            </span>
                            {v.overBudget && (
                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent-yellow/10 text-accent-yellow">
                                    Over Budget
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Summary */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Event Timeline Summary
                </h3>
                <div className="space-y-4">
                    {[
                        { time: '14:00', label: 'Vendor Setup Complete', status: 'on-time' },
                        { time: '16:00', label: 'Tech Rehearsal', status: 'on-time' },
                        { time: '18:00', label: 'Guest Arrivals Begin', status: 'delayed' },
                        { time: '19:00', label: 'Welcome & Keynote', status: 'on-time' },
                        { time: '20:00', label: 'Dinner Service', status: 'on-time' },
                        { time: '21:30', label: 'Entertainment & Dancing', status: 'on-time' },
                        { time: '23:00', label: 'Event Wrap-up', status: 'on-time' },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="text-xs font-black w-12 text-muted-foreground">{t.time}</span>
                            <div className={cn("h-2 w-2 rounded-full flex-shrink-0", t.status === 'on-time' ? 'bg-accent-green' : 'bg-accent-yellow')} />
                            <span className="text-xs font-medium">{t.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon: Icon, label, value, subtitle, accent }: {
    icon: any; label: string; value: string; subtitle: string; accent?: boolean;
}) => (
    <div className={cn("intelly-card p-6", accent && "ring-2 ring-primary/20")}>
        <div className="flex items-center gap-2 mb-2">
            <Icon className="h-4 w-4 text-primary opacity-50" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</span>
        </div>
        <h2 className="text-2xl font-black tracking-tighter italic">{value}</h2>
        <p className="text-[9px] font-bold opacity-40 mt-1">{subtitle}</p>
    </div>
);
