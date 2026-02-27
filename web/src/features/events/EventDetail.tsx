import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Calendar,
    MapPin,
    Users,
    Zap,
    IndianRupee,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Sparkles,
    Handshake
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import { GuestList } from '../guests/GuestList';
import { useAuthStore } from '../../stores/useAuthStore';

interface EventDetailProps {
    eventId: string;
    onBack: () => void;
}

export const EventDetail = ({ eventId, onBack }: EventDetailProps) => {
    const { workspace } = useAuthStore();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const fetchEvent = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single();

            if (!error && data) {
                setEvent(data);
            }
            setLoading(false);
        };

        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!event) return null;

    // Mock Health Dimensions based on PRD
    const healthDimensions = [
        { name: 'Venue', status: 'confirmed', score: 100, icon: MapPin },
        { name: 'Vendors', status: 'partial', score: 65, icon: Users },
        { name: 'Budget', status: 'track', score: 92, icon: IndianRupee },
        { name: 'Invites', status: 'sent', score: 100, icon: Sparkles },
        { name: 'RSVP', status: 'low', score: 45, icon: Users },
        { name: 'Run Sheet', status: 'draft', score: 30, icon: Clock },
        { name: 'Team', status: 'ready', score: 100, icon: ShieldCheck },
        { name: 'Payments', status: 'overdue', score: 80, icon: IndianRupee },
        { name: 'Legal/NOC', status: 'pending', score: 10, icon: ShieldCheck },
        { name: 'Content', status: 'active', score: 75, icon: Zap },
        { name: 'Sponsors', status: 'confirmed', score: 100, icon: Handshake },
        { name: 'Timeline', status: 'delayed', score: 85, icon: AlertTriangle },
    ];

    const overallScore = event.health_score || 72;

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Header / Sub-nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="h-12 w-12 rounded-2xl bg-white border border-border/60 flex items-center justify-center hover:bg-muted transition-colors shadow-sm"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-extrabold tracking-tight">{event.title}</h2>
                            <Badge variant="success" className="bg-primary/5 text-primary border-primary/10">LIVE OPS</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date_start ? new Date(event.date_start).toLocaleDateString() : 'TBD'}</span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.city}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-full bg-white font-bold h-12 px-6">
                        Edit Blueprint
                    </Button>
                    <Button className="rounded-full font-bold h-12 px-8 shadow-xl shadow-primary/20">
                        Launch Day Mode
                    </Button>
                </div>
            </div>

            {/* Health Score Overview Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Health Dashboard */}
                <Card className="lg:col-span-8 p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <ShieldCheck className="h-64 w-64" />
                    </div>

                    {/* Radial Score */}
                    <div className="relative h-56 w-56 shrink-0">
                        <svg className="h-full w-full -rotate-90">
                            <circle
                                cx="50%" cy="50%" r="90"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="12"
                                className="text-primary/10"
                            />
                            <circle
                                cx="50%" cy="50%" r="90"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeDasharray={2 * Math.PI * 90}
                                strokeDashoffset={2 * Math.PI * 90 * (1 - overallScore / 100)}
                                strokeLinecap="round"
                                className="text-primary transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black">{overallScore}%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status Score</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Event Readiness</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Your event is <span className="text-primary font-bold">trending healthy</span>.
                                Most core vendors are booked, but <span className="font-bold underline">Legal NOC</span> is currently at risk.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card glass className="p-4 bg-primary/5 border-primary/10 border shadow-none">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Top Strength</span>
                                </div>
                                <p className="text-sm font-bold">Venue & F&B confirmed</p>
                            </Card>
                            <Card glass className="p-4 bg-red-500/5 border-red-500/10 border shadow-none">
                                <div className="flex items-center gap-3 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Critical Risk</span>
                                </div>
                                <p className="text-sm font-bold">Sound Permits pending</p>
                            </Card>
                        </div>
                    </div>
                </Card>

                {/* Quick Stats Sidebar */}
                <Card className="lg:col-span-4 p-8 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            AI Insights
                        </h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 min-w-[40px] rounded-xl bg-muted flex items-center justify-center">
                                    <IndianRupee className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Budget Optimization</p>
                                    <p className="text-xs text-muted-foreground">You are ₹12k over on AV, but underspent on Decor. Reallocate?</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 min-w-[40px] rounded-xl bg-muted flex items-center justify-center">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Guest Drop-off Risk</p>
                                    <p className="text-xs text-muted-foreground">RSVP growth slowed by 4% this week compared to target.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full h-12 mt-8 rounded-xl font-bold border-border/60 hover:text-primary group">
                        Run Diagnostics
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Card>
            </div>

            {/* Content Area */}
            {activeTab === 'Overview' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {healthDimensions.map((dim, i) => (
                        <Card key={i} className="p-5 flex flex-col items-center text-center transition-all hover:border-primary/40 hover:scale-[1.02] cursor-default">
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                                dim.score === 100 ? "bg-primary/10 text-primary" :
                                    dim.score > 70 ? "bg-accent/10 text-accent" :
                                        dim.score > 30 ? "bg-secondary/10 text-secondary" : "bg-red-500/10 text-red-500"
                            )}>
                                <dim.icon className="h-6 w-6" />
                            </div>
                            <h5 className="font-bold text-sm mb-1">{dim.name}</h5>
                            <div className="h-1.5 w-full bg-muted rounded-full mt-2">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        dim.score === 100 ? "bg-primary" :
                                            dim.score > 70 ? "bg-accent" :
                                                dim.score > 30 ? "bg-secondary" : "bg-red-500"
                                    )}
                                    style={{ width: `${dim.score}%` }}
                                />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 tracking-widest">{dim.status}</span>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === 'Guests' && (
                <GuestList eventId={eventId} workspaceId={workspace?.id || ''} />
            )}

            {/* Placeholder for other tabs */}
            {['Planning', 'Vendors', 'Run Sheet', 'Budget', 'Post-Event'].includes(activeTab) && (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground font-medium">The {activeTab} module is coming soon to your workspace.</p>
                </Card>
            )}

            {/* Secondary Navigation (Mock) */}
            <div className="flex gap-2 p-1.5 bg-muted/50 rounded-[32px] border border-border/40 w-fit mx-auto sticky bottom-8 shadow-2xl backdrop-blur-md">
                {['Overview', 'Planning', 'Vendors', 'Guests', 'Run Sheet', 'Budget', 'Post-Event'].map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                            activeTab === item ? "bg-white text-primary shadow-lg" : "text-muted-foreground hover:bg-white/50"
                        )}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};


