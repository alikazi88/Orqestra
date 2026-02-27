import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Ticket,
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    TrendingUp,
    Package,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';

interface TicketType {
    id: string;
    name: string;
    price: number;
    quantity_total: number;
    quantity_sold: number;
    description: string;
    perks: string[];
}

interface TicketTypeManagerProps {
    eventId: string;
    workspaceId: string;
}

export const TicketTypeManager = ({ eventId, workspaceId }: TicketTypeManagerProps) => {
    const [types, setTypes] = useState<TicketType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newType, setNewType] = useState<Partial<TicketType>>({
        name: '',
        price: 0,
        quantity_total: 100,
        description: '',
        perks: []
    });

    useEffect(() => {
        fetchTicketTypes();
    }, [eventId]);

    const fetchTicketTypes = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await (supabase.from('ticket_types') as any)
                .select('*')
                .eq('event_id', eventId)
                .order('price', { ascending: true });

            if (error) throw error;
            setTypes(data || []);
        } catch (err) {
            console.error('Error fetching ticket types:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddType = async () => {
        if (!newType.name) return;

        try {
            const { error } = await (supabase.from('ticket_types') as any)
                .insert([{
                    ...newType,
                    event_id: eventId,
                    workspace_id: workspaceId,
                    quantity_sold: 0
                }]);

            if (error) throw error;
            fetchTicketTypes();
            setIsAdding(false);
            setNewType({
                name: '',
                price: 0,
                quantity_total: 100,
                description: '',
                perks: []
            });
        } catch (err) {
            console.error('Error adding ticket type:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await (supabase.from('ticket_types') as any)
                .delete()
                .eq('id', id);

            if (error) throw error;
            setTypes(types.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting ticket type:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white/50 border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Ticket className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Tiers</p>
                            <p className="text-xl font-black">{types.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-white/50 border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Sold</p>
                            <p className="text-xl font-black">{types.reduce((acc, t) => acc + t.quantity_sold, 0)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-white/50 border-border/40">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capacity</p>
                            <p className="text-xl font-black">{types.reduce((acc, t) => acc + t.quantity_total, 0)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Ticket Tiers List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black tracking-tight">Ticket Tiers</h3>
                    <Button
                        size="sm"
                        onClick={() => setIsAdding(true)}
                        className="rounded-xl font-black text-xs uppercase tracking-widest"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Tier
                    </Button>
                </div>

                {isAdding && (
                    <Card className="p-8 border-2 border-primary/20 bg-primary/[0.02] animate-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tier Name</label>
                                <input
                                    className="w-full h-12 bg-white border-2 border-border/40 rounded-xl px-4 font-bold outline-none focus:border-primary/40 transition-all"
                                    placeholder="e.g. VIP Early Bird"
                                    value={newType.name}
                                    onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price (USD)</label>
                                <input
                                    type="number"
                                    className="w-full h-12 bg-white border-2 border-border/40 rounded-xl px-4 font-bold outline-none focus:border-primary/40 transition-all"
                                    value={newType.price}
                                    onChange={(e) => setNewType({ ...newType, price: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full h-12 bg-white border-2 border-border/40 rounded-xl px-4 font-bold outline-none focus:border-primary/40 transition-all"
                                    value={newType.quantity_total}
                                    onChange={(e) => setNewType({ ...newType, quantity_total: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="md:col-span-4 flex items-end gap-3 pb-0.5">
                                <Button className="flex-1 h-12 rounded-xl font-black uppercase text-xs tracking-widest" onClick={handleAddType}>
                                    <Check className="h-4 w-4 mr-2" /> Save Tier
                                </Button>
                                <Button variant="outline" className="h-12 w-12 rounded-xl p-0" onClick={() => setIsAdding(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="md:col-span-12 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                <textarea
                                    className="w-full h-24 bg-white border-2 border-border/40 rounded-xl px-4 py-3 font-medium outline-none focus:border-primary/40 transition-all resize-none"
                                    placeholder="What does this ticket include?"
                                    value={newType.description}
                                    onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {types.map((type) => (
                        <Card key={type.id} className="p-6 bg-white border-border/40 hover:border-primary/20 transition-all group overflow-hidden relative">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 rounded-xl bg-muted/30 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Ticket className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-lg tracking-tight">{type.name}</h4>
                                            <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                                                ${type.price}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">{type.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Inventory</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${(type.quantity_sold / type.quantity_total) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black">{type.quantity_sold} / {type.quantity_total}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-10 w-10 rounded-xl p-0">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-10 w-10 rounded-xl p-0 text-red-600 hover:bg-red-50 hover:border-red-200"
                                            onClick={() => handleDelete(type.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Visual background hint */}
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                <Ticket className="h-32 w-32 -rotate-12" />
                            </div>
                        </Card>
                    ))}

                    {types.length === 0 && !isAdding && (
                        <div className="py-20 flex flex-col items-center justify-center text-center bg-muted/10 rounded-[32px] border-2 border-dashed border-border/40">
                            <AlertCircle className="h-10 w-10 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-black tracking-tight mb-1 uppercase">No Ticket Tiers Defined</h3>
                            <p className="text-xs text-muted-foreground font-medium max-w-[280px] mb-8">
                                Start by adding your first ticket tier (e.g. General Admission) to begin selling.
                            </p>
                            <Button className="rounded-2xl font-black uppercase text-xs tracking-widest px-8" onClick={() => setIsAdding(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Add First Tier
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
