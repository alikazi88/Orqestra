import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Calendar,
    MapPin,
    Ticket,
    ChevronRight,
    Check,
    Loader2,
    Info,
    ArrowLeft,
    Plus,
    Clock,
    Bell,
    X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';

interface EventBranding {
    hero_image_url?: string;
    accent_color: string;
    faq: { question: string, answer: string }[];
    theme: string;
}

interface TicketType {
    id: string;
    name: string;
    price: number;
    quantity_total: number;
    quantity_sold: number;
    description: string;
    perks: string[];
    sale_starts_at?: string;
    sale_ends_at?: string;
    show_remaining_count?: boolean;
    remaining_count_threshold?: number;
}

export const PublicEventPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<any>(null);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [waitlistTier, setWaitlistTier] = useState<string | null>(null);
    const [waitlistData, setWaitlistData] = useState({ name: '', email: '' });
    const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);

    useEffect(() => {
        if (slug) fetchEventDetails();
    }, [slug]);

    const fetchEventDetails = async () => {
        setIsLoading(true);
        try {
            const { data: eventData, error: eventError } = await (supabase.from('events') as any)
                .select('*')
                .eq('slug', slug || '')
                .single();

            if (eventError) throw eventError;
            setEvent(eventData);

            const { data: ticketData, error: ticketError } = await (supabase as any).from('ticket_types')
                .select('*')
                .eq('event_id', eventData.id)
                .order('price', { ascending: true });

            if (ticketError) throw ticketError;
            setTicketTypes(ticketData || []);
        } catch (err) {
            console.error('Error fetching public event details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTicket = (id: string, max: number) => {
        const current = selectedTickets[id] || 0;
        if (current < 10 && current < max) {
            setSelectedTickets({ ...selectedTickets, [id]: current + 1 });
        }
    };

    const handleRemoveTicket = (id: string) => {
        const current = selectedTickets[id] || 0;
        if (current > 0) {
            setSelectedTickets({ ...selectedTickets, [id]: current - 1 });
        }
    };

    const handleJoinWaitlist = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsJoiningWaitlist(true);
        try {
            const { error } = await (supabase as any).from('waitlist')
                .insert([{
                    event_id: event.id,
                    workspace_id: event.workspace_id,
                    ticket_type_id: waitlistTier,
                    email: waitlistData.email,
                    name: waitlistData.name
                }]);

            if (error) throw error;
            setWaitlistSuccess(true);
            setTimeout(() => {
                setWaitlistTier(null);
                setWaitlistSuccess(false);
                setWaitlistData({ name: '', email: '' });
            }, 3000);
        } catch (err) {
            console.error('Error joining waitlist:', err);
            alert("This email is already on the waitlist for this tier!");
        } finally {
            setIsJoiningWaitlist(false);
        }
    };

    const totalPrice = ticketTypes.reduce((acc, t) => acc + (t.price * (selectedTickets[t.id] || 0)), 0);
    const totalCount = Object.values(selectedTickets).reduce((acc, count) => acc + count, 0);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
                <div className="h-20 w-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                    <Info className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-4">Event Not Found</h1>
                <p className="text-muted-foreground font-medium mb-8">The event you're looking for doesn't exist or has been removed.</p>
                <Button variant="outline" className="rounded-2xl" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    const branding = (event.branding || {}) as EventBranding;
    const accentColor = branding.accent_color || '#7C3AED';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{
                        backgroundImage: `url(${branding.hero_image_url || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=2070'})`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-slate-50" />

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-6xl mx-auto w-full px-8 pb-12">
                        <div className="flex flex-col gap-6">
                            <span
                                className="w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl"
                                style={{ backgroundColor: accentColor }}
                            >
                                {event.metadata?.type || 'Special Event'}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                                {event.name}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 opacity-70" />
                                    <span className="font-black tracking-tight">{new Date(event.metadata?.date || Date.now()).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 opacity-70" />
                                    <span className="font-black tracking-tight">{event.metadata?.location || 'Venue details inside'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">
                {/* Left: Info & Tickets */}
                <div className="lg:col-span-8 space-y-12 mt-12">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">About the Event</h3>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed">
                            {event.metadata?.description || "Join us for an unforgettable experience. Experience the best performances, networking, and celebration at Orqestra's premium events."}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-3">
                            Select Tickets
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </h3>
                        <div className="space-y-4">
                            {ticketTypes.map((type) => {
                                const count = selectedTickets[type.id] || 0;
                                const remaining = type.quantity_total - type.quantity_sold;
                                const isSoldOut = remaining <= 0;

                                const now = new Date();
                                const saleStart = type.sale_starts_at ? new Date(type.sale_starts_at) : null;
                                const saleEnd = type.sale_ends_at ? new Date(type.sale_ends_at) : null;
                                const hasNotStarted = saleStart && now < saleStart;
                                const hasEnded = saleEnd && now > saleEnd;

                                const showUrgency = type.show_remaining_count && remaining > 0 && remaining <= (type.remaining_count_threshold || 10);

                                return (
                                    <Card
                                        key={type.id}
                                        className={cn(
                                            "p-8 bg-white border-2 border-border/40 transition-all group overflow-hidden relative",
                                            count > 0 && "border-primary/40 bg-primary/[0.01]",
                                            (isSoldOut || hasNotStarted || hasEnded) && "opacity-75"
                                        )}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h4 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{type.name}</h4>
                                                    <span className="text-lg font-black text-slate-400">$ {type.price}</span>
                                                    {showUrgency && (
                                                        <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase rounded-lg animate-pulse tracking-widest">
                                                            Selling Fast • Only {remaining} left
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium mb-4 max-w-md">{type.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {type.perks?.map((perk, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                                                            <Check className="h-3 w-3" /> {perk}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {isSoldOut ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-xs font-black uppercase tracking-widest text-red-500 px-6 py-2 bg-red-50 rounded-xl mb-1">Sold Out</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 hover:bg-slate-50"
                                                            onClick={() => setWaitlistTier(type.id)}
                                                        >
                                                            <Bell className="h-3 w-3 mr-2" /> Join Waitlist
                                                        </Button>
                                                    </div>
                                                ) : hasNotStarted ? (
                                                    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-border/40 min-w-[200px]">
                                                        <Clock className="h-5 w-5 text-primary mb-2 animate-bounce" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Sales Drop In</p>
                                                        <p className="text-sm font-black tracking-tight">{saleStart!.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                ) : hasEnded ? (
                                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground px-6 py-2 bg-slate-100 rounded-xl">Sales Closed</span>
                                                ) : (
                                                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-border/40">
                                                        <button
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all disabled:opacity-30"
                                                            onClick={() => handleRemoveTicket(type.id)}
                                                            disabled={count === 0}
                                                        >
                                                            <ArrowLeft className="h-4 w-4 rotate-90" />
                                                        </button>
                                                        <span className="w-8 text-center font-black text-lg">{count}</span>
                                                        <button
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-30"
                                                            onClick={() => handleAddTicket(type.id, remaining)}
                                                            disabled={count >= 10 || count >= remaining}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Background icon for visual flair */}
                                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                            <Ticket className="h-32 w-32 -rotate-12" />
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right: Checkout Summary (Sticky) */}
                <div className="lg:col-span-4 mt-12">
                    <Card className="p-8 sticky top-32 bg-white/50 backdrop-blur-xl border-border/40 shadow-2xl shadow-primary/5">
                        <div className="flex items-center gap-3 mb-8">
                            <Ticket className="h-5 w-5 text-primary" />
                            <h3 className="font-black text-sm uppercase tracking-widest">Order Summary</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            {Object.entries(selectedTickets).map(([id, count]) => {
                                if (count === 0) return null;
                                const type = ticketTypes.find(t => t.id === id);
                                if (!type) return null;
                                return (
                                    <div key={id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black">x{count}</span>
                                            <span className="font-medium text-muted-foreground">{type.name}</span>
                                        </div>
                                        <span className="font-black">${type.price * count}</span>
                                    </div>
                                );
                            })}

                            {totalCount === 0 && (
                                <div className="py-8 text-center opacity-40">
                                    <p className="text-xs font-black uppercase tracking-widest">No tickets selected</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-border/40 mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total</span>
                                <span className="text-3xl font-black tracking-tighter">${totalPrice}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30"
                            disabled={totalCount === 0 || isCheckingOut}
                            onClick={() => {
                                setIsCheckingOut(true);
                                setTimeout(() => {
                                    setIsCheckingOut(false);
                                    alert("Checkout simulation: In a production environment, you would now be redirected to the payment gateway.");
                                }, 1500);
                            }}
                            style={{ backgroundColor: accentColor }}
                        >
                            {isCheckingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Complete Booking'}
                            {!isCheckingOut && <ChevronRight className="h-4 w-4 ml-2" />}
                        </Button>

                        <p className="text-[10px] text-muted-foreground font-medium text-center mt-6 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Check className="h-3 w-3 text-emerald-500" /> Secure Checkout by Orqestra
                        </p>
                    </Card>
                </div>
            </main>

            {/* Waitlist Modal */}
            {waitlistTier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isJoiningWaitlist && setWaitlistTier(null)} />
                    <Card className="max-w-md w-full p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
                        {waitlistSuccess ? (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">You're on the list!</h3>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">We'll notify you if more capacity becomes available for {ticketTypes.find(t => t.id === waitlistTier)?.name}.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-primary" /> Join Waitlist
                                    </h3>
                                    <button
                                        onClick={() => setWaitlistTier(null)}
                                        className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                                        disabled={isJoiningWaitlist}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <form onSubmit={handleJoinWaitlist} className="space-y-6">
                                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/40">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Tier Interested In</p>
                                        <p className="text-sm font-black">{ticketTypes.find(t => t.id === waitlistTier)?.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                        <input
                                            required
                                            className="w-full h-12 bg-white border-2 border-border/40 rounded-xl px-4 font-bold outline-none focus:border-primary/40 transition-all"
                                            value={waitlistData.name}
                                            onChange={(e) => setWaitlistData({ ...waitlistData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full h-12 bg-white border-2 border-border/40 rounded-xl px-4 font-bold outline-none focus:border-primary/40 transition-all"
                                            value={waitlistData.email}
                                            onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                                        disabled={isJoiningWaitlist}
                                    >
                                        {isJoiningWaitlist ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                        {isJoiningWaitlist ? 'Joining...' : 'Add me to Waitlist'}
                                    </Button>
                                </form>
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};
