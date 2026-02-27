import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
    Users,
    Search,
    Filter,
    FileUp,
    Sparkles,
    MoreHorizontal,
    Mail,
    Phone,
    CheckCircle2,
    Clock,
    UserPlus,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import { CSVImportModal } from './CSVImportModal';
import { GuestProfileModal } from './GuestProfileModal';

interface Guest {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    tier: 'vip' | 'trade' | 'press' | 'general' | null;
    rsvp_status: 'pending' | 'confirmed' | 'declined' | 'waitlisted' | null;
    dietary?: string | null;
    metadata?: any;
}

interface GuestListProps {
    eventId: string;
    workspaceId: string;
}

export const GuestList = ({ eventId, workspaceId }: GuestListProps) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTier, setSelectedTier] = useState<string>('all');
    const [isSegmenting, setIsSegmenting] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        fetchGuests();
    }, [eventId]);

    const fetchGuests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('guests')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setGuests(data as unknown as Guest[]);
        }
        setLoading(false);
    };

    const handleAISegment = async () => {
        setIsSegmenting(true);
        try {
            const { error } = await supabase.functions.invoke('ai-guest-segmenter', {
                body: { eventId, workspaceId }
            });
            if (!error) {
                await fetchGuests();
            }
        } catch (err) {
            console.error('AI Segmenting failed', err);
        } finally {
            setIsSegmenting(false);
        }
    };

    const filteredGuests = guests.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTier = selectedTier === 'all' || guest.tier === selectedTier;
        return matchesSearch && matchesTier;
    });

    const tierColors = {
        vip: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        trade: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        press: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        general: 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    };

    const rsvpIcons: Record<string, React.ReactNode> = {
        confirmed: <CheckCircle2 className="h-4 w-4 text-primary" />,
        pending: <Clock className="h-4 w-4 text-amber-500" />,
        declined: <Users className="h-4 w-4 text-muted-foreground" />,
        waitlisted: <Clock className="h-4 w-4 text-secondary" />
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search guests..."
                            className="pl-10 h-11 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-11 px-4 bg-white border-border/60">
                        <Filter className="h-4 w-4 mr-2" />
                        <select
                            className="bg-transparent text-sm font-medium focus:outline-none"
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                        >
                            <option value="all">All Tiers</option>
                            <option value="vip">VIP</option>
                            <option value="trade">Trade</option>
                            <option value="press">Press</option>
                            <option value="general">General</option>
                        </select>
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleAISegment}
                        isLoading={isSegmenting}
                        className="h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold shadow-lg shadow-primary/20"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Segment with AI
                    </Button>
                    <Button
                        variant="outline"
                        className="h-11 px-6 rounded-xl bg-white border-border/60 font-bold"
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        <FileUp className="h-4 w-4 mr-2" />
                        Import CSV
                    </Button>
                    <Button className="h-11 w-11 p-0 rounded-xl bg-primary text-white">
                        <UserPlus className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white/50 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Guests</p>
                    <p className="text-2xl font-black">{guests.length}</p>
                </Card>
                <Card className="p-4 bg-white/50 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">VIP Tier</p>
                    <p className="text-2xl font-black text-amber-600">{guests.filter(g => g.tier === 'vip').length}</p>
                </Card>
                <Card className="p-4 bg-white/50 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Confirmed</p>
                    <p className="text-2xl font-black text-primary">{guests.filter(g => g.rsvp_status === 'confirmed').length}</p>
                </Card>
                <Card className="p-4 bg-white/50 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Pending RSVP</p>
                    <p className="text-2xl font-black text-amber-500">{guests.filter(g => g.rsvp_status === 'pending').length}</p>
                </Card>
            </div>

            {/* Guest Table */}
            <Card className="overflow-hidden border-border/40 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/40">
                                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Guest</th>
                                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Tier</th>
                                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">RSVP Status</th>
                                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Contact</th>
                                <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Mobilizing guest list...</p>
                                    </td>
                                </tr>
                            ) : filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <p className="font-bold">No guests found</p>
                                        <p className="text-sm text-muted-foreground">Start by importing a CSV or adding manually.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr
                                        key={guest.id}
                                        className="hover:bg-muted/10 transition-colors group cursor-pointer"
                                        onClick={() => { setSelectedGuest(guest); setIsProfileOpen(true); }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {guest.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{guest.name}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                                                        {guest.metadata?.company || 'Personal Invitation'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={cn("rounded-lg font-bold text-[10px] px-2.5 py-1 uppercase", tierColors[(guest.tier as keyof typeof tierColors) || 'general'])}
                                            >
                                                {guest.tier || 'general'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {rsvpIcons[guest.rsvp_status || 'pending']}
                                                <span className="text-sm font-medium capitalize">{guest.rsvp_status || 'pending'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                </button>
                                                <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors ml-auto">
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <CSVImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onComplete={() => fetchGuests()}
                eventId={eventId}
                workspaceId={workspaceId}
            />

            <GuestProfileModal
                isOpen={isProfileOpen}
                guest={selectedGuest}
                onClose={() => { setIsProfileOpen(false); setSelectedGuest(null); }}
                onUpdate={fetchGuests}
            />
        </div>
    );
};
