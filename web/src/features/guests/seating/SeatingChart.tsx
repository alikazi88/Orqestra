import { useState, useEffect, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
    Users,
    Search,
    Brain,
    RotateCcw,
    UserPlus,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { cn } from '../../../utils/cn';

interface SeatingChartProps {
    eventId: string;
    workspaceId: string;
}

interface Guest {
    id: string;
    name: string;
    tier: string;
    table_id: string | null;
    seat_number?: number | null;
    metadata?: any;
}

interface LayoutObject {
    id: string;
    type: 'zone' | 'furniture' | 'av';
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    color: string;
}

export const SeatingChart = ({ eventId, workspaceId }: SeatingChartProps) => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [layout, setLayout] = useState<LayoutObject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAutoSeating, setIsAutoSeating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
    const canvasRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        fetchData();
    }, [eventId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch guests
            const { data: guestsData } = await supabase
                .from('guests')
                .select('*')
                .eq('event_id', eventId)
                .order('name');

            setGuests((guestsData as any) || []);

            // 2. Fetch venue layout for this event (or a template for the venue)
            // For now, we'll try to find any layout associated with the venue of this event
            const { data: eventData } = await supabase
                .from('events')
                .select('metadata')
                .eq('id', eventId)
                .single();

            const venueId = (eventData?.metadata as any)?.venue_id;

            if (venueId) {
                const { data: layouts } = await (supabase.from('venue_layouts') as any)
                    .select('data')
                    .eq('venue_id', venueId)
                    .order('updated_at', { ascending: false })
                    .limit(1);

                if (layouts && layouts[0]) {
                    setLayout(layouts[0].data as LayoutObject[]);
                }
            }
        } catch (err) {
            console.error('Error fetching seating data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = (guestId: string) => {
        setDraggedGuestId(guestId);
    };

    const handleDrop = async (tableId: string) => {
        if (!draggedGuestId) return;

        // Optimistic update
        const updatedGuests = guests.map(g =>
            g.id === draggedGuestId ? { ...g, table_id: tableId } : g
        );
        setGuests(updatedGuests);

        try {
            const { error } = await (supabase.from('guests') as any)
                .update({ table_id: tableId })
                .eq('id', draggedGuestId);

            if (error) throw error;
        } catch (err) {
            console.error('Error saving seat assignment:', err);
            // Revert on error
            fetchData();
        } finally {
            setDraggedGuestId(null);
        }
    };

    const runSmartPlacement = async () => {
        setIsAutoSeating(true);
        // Artificial delay for "thinking" effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        const tables = layout.filter(obj => obj.type === 'furniture');
        const unseated = guests.filter(g => !g.table_id);

        if (tables.length === 0 || unseated.length === 0) {
            setIsAutoSeating(false);
            return;
        }

        // Logic: 
        // 1. Group by company
        // 2. VIPs first
        // 3. Fill tables (max 8 per table)

        const updates: any[] = [];
        let tableIndex = 0;
        let seatsFilledInCurrentTable = 0;
        const SEATS_PER_TABLE = 8;

        // Sort: VIPs first, then alphabetical
        const sortedGuests = [...unseated].sort((a, b) => {
            if (a.tier === 'vip' && b.tier !== 'vip') return -1;
            if (a.tier !== 'vip' && b.tier === 'vip') return 1;
            return a.name.localeCompare(b.name);
        });

        sortedGuests.forEach((guest) => {
            if (tableIndex < tables.length) {
                updates.push({
                    id: guest.id,
                    table_id: tables[tableIndex].id,
                    workspace_id: workspaceId,
                    event_id: eventId,
                    name: guest.name
                });

                seatsFilledInCurrentTable++;
                if (seatsFilledInCurrentTable >= SEATS_PER_TABLE) {
                    tableIndex++;
                    seatsFilledInCurrentTable = 0;
                }
            }
        });

        try {
            const { error } = await (supabase.from('guests') as any).upsert(updates);
            if (error) throw error;
            fetchData();
        } catch (err) {
            console.error('Smart placement failed:', err);
        } finally {
            setIsAutoSeating(false);
        }
    };

    const unseatedGuests = guests.filter(g => !g.table_id && g.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (isLoading) {
        return (
            <div className="h-[600px] flex items-center justify-center bg-muted/10 rounded-[32px] border-2 border-dashed border-border/40">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] animate-in fade-in duration-500">
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Seating Chart</h2>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1">
                            {guests.filter(g => g.table_id).length} of {guests.length} Guests Seated
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={runSmartPlacement}
                        disabled={isAutoSeating || unseatedGuests.length === 0}
                        className="rounded-xl border-border/60 font-bold h-11 px-6 bg-white hover:bg-primary/5 transition-all text-sm group"
                    >
                        {isAutoSeating ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Brain className="h-4 w-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                        )}
                        Smart Placement
                    </Button>
                    <Button
                        onClick={() => fetchData()}
                        className="rounded-xl font-bold h-11 px-6 shadow-lg shadow-primary/20"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Guest Sidebar */}
                <Card className="w-80 flex flex-col p-6 overflow-hidden border-border/40 bg-white/50 backdrop-blur-sm">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Find unseated guests..."
                            className="w-full h-11 bg-muted/40 border-none rounded-xl pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground mb-4 block">
                            Unseated ({unseatedGuests.length})
                        </label>

                        {unseatedGuests.map(guest => (
                            <div
                                key={guest.id}
                                draggable
                                onDragStart={() => handleDragStart(guest.id)}
                                className="p-4 bg-white border border-border/60 rounded-2xl cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-md transition-all group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase",
                                        guest.tier === 'vip' ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"
                                    )}>
                                        {guest.name.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate leading-none mb-1">{guest.name}</p>
                                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">{guest.tier}</p>
                                    </div>
                                </div>
                                <UserPlus className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                            </div>
                        ))}

                        {unseatedGuests.length === 0 && (
                            <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                                <CheckCircle2 className="h-8 w-8 mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest">All guests seated</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Seating Map Canvas */}
                <div className="flex-1 relative bg-slate-50/50 rounded-[40px] border-2 border-border/40 overflow-hidden group">
                    <svg
                        ref={canvasRef}
                        className="w-full h-full bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:32px_32px]"
                    >
                        {layout.map((obj) => (
                            <g
                                key={obj.id}
                                transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}, ${obj.width / 2}, ${obj.height / 2})`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(obj.id)}
                                className={cn(
                                    "transition-all duration-300",
                                    obj.type === 'furniture' ? "cursor-default" : "pointer-events-none opacity-20"
                                )}
                            >
                                <rect
                                    width={obj.width}
                                    height={obj.height}
                                    rx={obj.type === 'zone' ? 16 : 12}
                                    fill={obj.color}
                                    fillOpacity={obj.type === 'zone' ? 0.05 : 0.8}
                                    stroke={obj.color}
                                    strokeWidth={2}
                                    className={cn(
                                        "transition-all",
                                        obj.type === 'furniture' && "drop-shadow-sm group-hover:drop-shadow-md"
                                    )}
                                />

                                {obj.type === 'furniture' && (
                                    <>
                                        {/* Table Info */}
                                        <foreignObject
                                            x={0}
                                            y={0}
                                            width={obj.width}
                                            height={obj.height}
                                        >
                                            <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                                <p className="text-[10px] font-black uppercase tracking-tighter text-white mb-1 shadow-sm">
                                                    {obj.label}
                                                </p>
                                                <div className="flex gap-0.5">
                                                    {[...Array(8)].map((_, i) => {
                                                        const seatedAtTable = guests.filter(g => g.table_id === obj.id);
                                                        const isOccupied = i < seatedAtTable.length;
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={cn(
                                                                    "h-1.5 w-1.5 rounded-full border border-white/20",
                                                                    isOccupied ? "bg-white" : "bg-white/30"
                                                                )}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </foreignObject>

                                        {/* Seated Guests Popup Header */}
                                        <g transform={`translate(${obj.width / 2}, -10)`}>
                                            <text
                                                textAnchor="middle"
                                                className="text-[9px] font-black fill-muted-foreground uppercase tracking-widest"
                                            >
                                                {guests.filter(g => g.table_id === obj.id).length} seated
                                            </text>
                                        </g>
                                    </>
                                )}
                            </g>
                        ))}
                    </svg>

                    {/* Empty State / Hints */}
                    {layout.length === 0 && !isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-sm m-8 rounded-[32px] border-2 border-dashed border-border/40">
                            <XCircle className="h-10 w-10 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-black tracking-tight mb-1 uppercase">No Venue Layout Found</h3>
                            <p className="text-xs text-muted-foreground font-medium max-w-[280px]">
                                Go to the Venue Discovery tab to design your layout before seating guests.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
