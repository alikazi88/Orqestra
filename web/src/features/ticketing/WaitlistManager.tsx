import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Users,
    Download,
    Search,
    Mail,
    Calendar,
    Ticket,
    Loader2,
    Inbox
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';

interface WaitlistEntry {
    id: string;
    email: string;
    name: string;
    created_at: string;
    ticket_type_id: string | null;
    ticket_types?: {
        name: string;
    };
}

interface WaitlistManagerProps {
    eventId: string;
}

export const WaitlistManager = ({ eventId }: WaitlistManagerProps) => {
    const [entries, setEntries] = useState<WaitlistEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWaitlist();
    }, [eventId]);

    const fetchWaitlist = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await (supabase as any).from('waitlist')
                .select('*, ticket_types(name)')
                .eq('event_id', eventId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEntries(data || []);
        } catch (err) {
            console.error('Error fetching waitlist:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        const exportData = entries.map(entry => ({
            Name: entry.name || 'Anonymous',
            Email: entry.email,
            Tier: entry.ticket_types?.name || 'General Event',
            JoinedAt: new Date(entry.created_at).toLocaleString()
        }));

        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `waitlist_event_${eventId}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredEntries = entries.filter(e =>
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.name && e.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" /> Event Waitlist
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">
                        {entries.length} people are waiting for tickets
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full h-10 bg-white border-2 border-border/40 rounded-xl pl-10 pr-4 text-sm font-bold outline-none focus:border-primary/40 transition-all"
                            placeholder="Search waitlist..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-4"
                        onClick={handleExport}
                        disabled={entries.length === 0}
                    >
                        <Download className="h-3.5 w-3.5 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* List */}
            <Card className="overflow-hidden border-border/40 bg-white/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/40">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Guest</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interest</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined At</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {filteredEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-primary/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                                {entry.name ? entry.name[0].toUpperCase() : 'A'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black">{entry.name || 'Anonymous'}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                    <Mail className="h-2.5 w-2.5" /> {entry.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-xs font-bold">{entry.ticket_types?.name || 'Any Tier'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="text-xs font-medium">{new Date(entry.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded-md border border-amber-100">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredEntries.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Inbox className="h-10 w-10 text-muted-foreground/20 mb-3" />
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">No waitlist entries found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
