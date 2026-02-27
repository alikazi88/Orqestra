import { useEffect, useState, useCallback } from 'react';
import {
    Plus, Trash2, Loader2, Trophy,
    TrendingUp, Users, Mail,
    CheckCircle2, Clock, XCircle, Star
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';

interface Sponsorship {
    id: string;
    workspace_id: string;
    event_id: string;
    sponsor_name: string;
    tier: string;
    deal_value: number;
    amount_received: number;
    status: string;
    deliverables: string[];
    contact_name: string | null;
    contact_email: string | null;
    notes: string | null;
}

const TIERS = ['title', 'platinum', 'gold', 'silver', 'bronze', 'in-kind'] as const;
const STATUSES = ['prospect', 'pitched', 'negotiating', 'confirmed', 'fulfilled', 'declined'] as const;

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    title: { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', text: 'text-white', border: 'border-yellow-400/30' },
    platinum: { bg: 'bg-gradient-to-r from-slate-300 to-slate-400', text: 'text-white', border: 'border-slate-300/30' },
    gold: { bg: 'bg-gradient-to-r from-yellow-300 to-yellow-500', text: 'text-yellow-900', border: 'border-yellow-300/30' },
    silver: { bg: 'bg-gradient-to-r from-gray-200 to-gray-300', text: 'text-gray-700', border: 'border-gray-200/30' },
    bronze: { bg: 'bg-gradient-to-r from-orange-300 to-orange-400', text: 'text-orange-900', border: 'border-orange-300/30' },
    'in-kind': { bg: 'bg-accent-blue/20', text: 'text-accent-blue', border: 'border-accent-blue/20' },
};

const STATUS_CONFIG: Record<string, { icon: any; color: string }> = {
    prospect: { icon: Star, color: 'text-muted-foreground' },
    pitched: { icon: Mail, color: 'text-accent-blue' },
    negotiating: { icon: Clock, color: 'text-accent-yellow' },
    confirmed: { icon: CheckCircle2, color: 'text-accent-green' },
    fulfilled: { icon: Trophy, color: 'text-primary' },
    declined: { icon: XCircle, color: 'text-accent-pink' },
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export const SponsorshipTracker = ({ eventId, workspaceId }: { eventId: string; workspaceId: string }) => {
    const [sponsors, setSponsors] = useState<Sponsorship[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchSponsors = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('sponsorships')
            .select('*')
            .eq('event_id', eventId)
            .eq('workspace_id', workspaceId)
            .order('deal_value', { ascending: false });

        if (!error && data) {
            setSponsors(data as Sponsorship[]);
        }
        setLoading(false);
    }, [eventId, workspaceId]);

    useEffect(() => { fetchSponsors(); }, [fetchSponsors]);

    const totalDealValue = sponsors.reduce((s, sp) => s + (sp.deal_value || 0), 0);
    const totalReceived = sponsors.reduce((s, sp) => s + (sp.amount_received || 0), 0);
    const confirmedRevenue = sponsors.filter(s => ['confirmed', 'fulfilled'].includes(s.status)).reduce((s, sp) => s + (sp.deal_value || 0), 0);
    const pipeline = sponsors.filter(s => ['prospect', 'pitched', 'negotiating'].includes(s.status)).reduce((s, sp) => s + (sp.deal_value || 0), 0);

    const handleAdd = async () => {
        setSaving('new');
        const { data, error } = await supabase.from('sponsorships').insert({
            workspace_id: workspaceId,
            event_id: eventId,
            sponsor_name: 'New Sponsor',
            tier: 'bronze',
            deal_value: 0,
            amount_received: 0,
            status: 'prospect',
            deliverables: [],
        }).select().single();

        if (!error && data) {
            setSponsors(prev => [data as Sponsorship, ...prev]);
            setExpandedId((data as Sponsorship).id);
        }
        setSaving(null);
    };

    const handleDelete = async (id: string) => {
        setSaving(id);
        const { error } = await supabase.from('sponsorships').delete().eq('id', id);
        if (!error) setSponsors(prev => prev.filter(s => s.id !== id));
        setSaving(null);
    };

    const updateField = async (id: string, field: string, value: any) => {
        setSaving(id);
        const { error } = await supabase.from('sponsorships').update({ [field]: value, updated_at: new Date().toISOString() }).eq('id', id);
        if (!error) setSponsors(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
        setSaving(null);
    };

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard label="Total Pipeline" value={totalDealValue} icon={TrendingUp} color="bg-accent-blue/10 text-accent-blue" />
                <SummaryCard label="Confirmed Revenue" value={confirmedRevenue} icon={CheckCircle2} color="bg-accent-green/10 text-accent-green" />
                <SummaryCard label="Amount Received" value={totalReceived} icon={Trophy} color="bg-primary/10 text-primary" />
                <SummaryCard label="Active Pipeline" value={pipeline} icon={Clock} color="bg-accent-yellow/10 text-accent-yellow" subtitle={`${sponsors.filter(s => ['prospect', 'pitched', 'negotiating'].includes(s.status)).length} prospects`} />
            </div>

            {/* Collection Progress */}
            {totalDealValue > 0 && (
                <div className="intelly-card p-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest opacity-50">Collection Progress</h3>
                        <span className="text-sm font-black">{totalDealValue > 0 ? ((totalReceived / totalDealValue) * 100).toFixed(0) : 0}% Collected</span>
                    </div>
                    <div className="h-4 bg-muted/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-accent-green rounded-full transition-all duration-700"
                            style={{ width: `${totalDealValue > 0 ? (totalReceived / totalDealValue) * 100 : 0}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-bold opacity-40">{formatCurrency(totalReceived)} received</span>
                        <span className="text-[10px] font-bold opacity-40">{formatCurrency(totalDealValue - totalReceived)} remaining</span>
                    </div>
                </div>
            )}

            {/* Sponsors List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black tracking-tighter uppercase italic">Sponsors</h3>
                    <button
                        onClick={handleAdd}
                        disabled={saving === 'new'}
                        className="h-10 px-6 bg-[#1a1a1a] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-2 hover:-translate-y-0.5 transition-transform disabled:opacity-50"
                    >
                        {saving === 'new' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        Add Sponsor
                    </button>
                </div>

                {sponsors.length === 0 && (
                    <div className="intelly-card p-12 text-center">
                        <Users className="h-10 w-10 mx-auto mb-4 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No sponsors yet — add one above</p>
                    </div>
                )}

                {sponsors.map(sp => {
                    const tierStyle = TIER_COLORS[sp.tier] || TIER_COLORS.bronze;
                    const statusCfg = STATUS_CONFIG[sp.status] || STATUS_CONFIG.prospect;
                    const StatusIcon = statusCfg.icon;
                    const isExpanded = expandedId === sp.id;

                    return (
                        <div key={sp.id} className={cn("intelly-card overflow-hidden transition-all", isExpanded && "ring-2 ring-primary/20")}>
                            {/* Header Row */}
                            <div
                                className="p-6 flex items-center gap-6 cursor-pointer hover:bg-muted/20 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : sp.id)}
                            >
                                {/* Tier Badge */}
                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black uppercase shadow-lg", tierStyle.bg, tierStyle.text)}>
                                    {sp.tier.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black tracking-tight truncate">{sp.sponsor_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md", tierStyle.bg, tierStyle.text)}>{sp.tier}</span>
                                        <StatusIcon className={cn("h-3 w-3", statusCfg.color)} />
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">{sp.status}</span>
                                    </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-black tracking-tighter">{formatCurrency(sp.deal_value)}</p>
                                    <p className="text-[9px] font-bold opacity-40">{formatCurrency(sp.amount_received)} received</p>
                                </div>
                            </div>

                            {/* Expanded Detail */}
                            {isExpanded && (
                                <div className="border-t border-border/10 p-6 bg-muted/10 space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <InlineField
                                            label="Sponsor Name"
                                            value={sp.sponsor_name}
                                            onChange={(v) => updateField(sp.id, 'sponsor_name', v)}
                                        />
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">Tier</label>
                                            <select
                                                value={sp.tier}
                                                onChange={(e) => updateField(sp.id, 'tier', e.target.value)}
                                                className="w-full bg-white border border-border/20 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                {TIERS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">Status</label>
                                            <select
                                                value={sp.status}
                                                onChange={(e) => updateField(sp.id, 'status', e.target.value)}
                                                className="w-full bg-white border border-border/20 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <InlineField
                                            label="Contact Email"
                                            value={sp.contact_email || ''}
                                            onChange={(v) => updateField(sp.id, 'contact_email', v)}
                                            placeholder="email@company.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <InlineField
                                            label="Deal Value (₹)"
                                            value={String(sp.deal_value)}
                                            onChange={(v) => updateField(sp.id, 'deal_value', parseFloat(v) || 0)}
                                            type="number"
                                        />
                                        <InlineField
                                            label="Amount Received (₹)"
                                            value={String(sp.amount_received)}
                                            onChange={(v) => updateField(sp.id, 'amount_received', parseFloat(v) || 0)}
                                            type="number"
                                        />
                                        <InlineField
                                            label="Contact Name"
                                            value={sp.contact_name || ''}
                                            onChange={(v) => updateField(sp.id, 'contact_name', v)}
                                            placeholder="Point of contact"
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => handleDelete(sp.id)}
                                            disabled={saving === sp.id}
                                            className="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            {saving === sp.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ──────────── Sub-components ──────────── */

const SummaryCard = ({ label, value, icon: Icon, color, subtitle }: {
    label: string; value: number; icon: any; color: string; subtitle?: string;
}) => (
    <div className="intelly-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
            <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", color)}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
        </div>
        <h2 className="text-2xl font-black tracking-tighter italic">{formatCurrency(value)}</h2>
        {subtitle && <p className="text-[9px] font-bold opacity-40 mt-1">{subtitle}</p>}
    </div>
);

const InlineField = ({ label, value, onChange, type = 'text', placeholder }: {
    label: string; value: string; onChange: (val: string) => void; type?: string; placeholder?: string;
}) => (
    <div>
        <label className="text-[9px] font-black uppercase tracking-widest opacity-40 block mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border border-border/20 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
    </div>
);
