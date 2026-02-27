import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
    Calendar,
    MapPin,
    Users as UsersIcon,
    ChevronRight,
    Plus,
    Search,
    Filter,
    LayoutGrid,
    List as ListIcon,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { cn } from '../../utils/cn';

interface EventsListProps {
    onSelectEvent: (eventId: string) => void;
    onCreateNew: () => void;
}

export const EventsList = ({ onSelectEvent, onCreateNew }: EventsListProps) => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { workspace } = useAuthStore();

    useEffect(() => {
        const fetchEvents = async () => {
            if (!workspace) return;

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('workspace_id', workspace.id)
                .order('date_start', { ascending: true });

            if (!error && data) {
                setEvents(data);
            }
            setLoading(false);
        };

        fetchEvents();
    }, [workspace]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground font-medium">Loading your events...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Events</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage and track all your upcoming and past experiences.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-muted rounded-xl border border-border/50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <ListIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <Button onClick={onCreateNew} className="rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" />
                        New Event
                    </Button>
                </div>
            </div>

            {/* Filters / Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search events by name, city, or status..."
                        className="w-full h-12 pl-12 pr-4 bg-white border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 rounded-2xl bg-white border-border/60 font-semibold group">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    Filters
                </Button>
            </div>

            {events.length === 0 ? (
                <Card glass className="p-20 flex flex-col items-center text-center border-dashed border-2">
                    <div className="h-16 w-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-6">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No events found</h3>
                    <p className="text-muted-foreground max-w-sm mb-8">
                        You haven't created any events in this workspace yet. Start by building your first AI-powered event blueprint.
                    </p>
                    <Button onClick={onCreateNew} variant="outline" className="rounded-full px-8 font-bold">
                        Launch First Event
                    </Button>
                </Card>
            ) : (
                <div className={cn(
                    "grid gap-6",
                    viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                    {events.map((event) => (
                        <button
                            key={event.id}
                            onClick={() => onSelectEvent(event.id)}
                            className="text-left group transition-transform active:scale-[0.98]"
                        >
                            <Card className="h-full hover:border-primary/50 hover:shadow-premium transition-all p-0 overflow-hidden flex flex-col">
                                <div className="h-32 bg-muted relative group-hover:bg-muted/80 transition-colors">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    <Badge
                                        variant={event.status === 'planning' ? 'info' : event.status === 'live' ? 'success' : 'default'}
                                        className="absolute top-4 right-4 uppercase tracking-widest text-[10px] font-bold px-3 py-1"
                                    >
                                        {event.status}
                                    </Badge>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h4 className="text-xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h4>

                                    <div className="space-y-3 mb-6 flex-1 text-sm text-muted-foreground font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 opacity-70" />
                                            {event.date_start ? new Date(event.date_start).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 opacity-70" />
                                            {event.city}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <UsersIcon className="h-4 w-4 opacity-70" />
                                            {event.health_score || 0}% Completion
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-7 w-7 rounded-full bg-muted border-2 border-white overflow-hidden">
                                                    <img src={`https://ui-avatars.com/api/?name=Team+${i}&background=random`} alt="Team member" />
                                                </div>
                                            ))}
                                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary border-2 border-white flex items-center justify-center text-[10px] font-bold">
                                                +2
                                            </div>
                                        </div>
                                        <div className="text-primary font-bold text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                                            View CMD Center
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
