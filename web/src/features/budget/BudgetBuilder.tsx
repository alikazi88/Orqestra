import { useEffect, useState, useCallback } from 'react';
import {
    Plus, Trash2, IndianRupee, TrendingUp,
    TrendingDown, Loader2, AlertCircle,
    PieChart, Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import { TaxTracker } from './TaxTracker';
import { BudgetAlerts } from './BudgetAlerts';
import { SponsorshipTracker } from './SponsorshipTracker';
import { PlatformFeeCalculator } from './PlatformFeeCalculator';

interface BudgetLine {
    id: string;
    category: string;
    description: string | null;
    estimated: number;
    committed: number;
    actual: number;
    gst_rate: number;
    tds_rate: number;
    workspace_id: string;
    event_id: string;
}

const CATEGORIES = [
    'Venue & Infrastructure',
    'Food & Beverage',
    'Tech & AV',
    'Décor & Florals',
    'Entertainment & Artists',
    'Photography & Video',
    'Marketing & Print',
    'Logistics & Transport',
    'Staffing & Security',
    'Miscellaneous'
];

const CATEGORY_COLORS: Record<string, string> = {
    'Venue & Infrastructure': '#6C5CE7',
    'Food & Beverage': '#00B894',
    'Tech & AV': '#0984E3',
    'Décor & Florals': '#E17055',
    'Entertainment & Artists': '#D63031',
    'Photography & Video': '#FDCB6E',
    'Marketing & Print': '#A29BFE',
    'Logistics & Transport': '#74B9FF',
    'Staffing & Security': '#55EFC4',
    'Miscellaneous': '#B2BEC3'
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export const BudgetBuilder = ({ eventId, workspaceId }: { eventId: string; workspaceId: string }) => {
    const [lines, setLines] = useState<BudgetLine[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
    const [editValue, setEditValue] = useState('');
    const [budgetView, setBudgetView] = useState<'builder' | 'tax' | 'alerts' | 'sponsors' | 'fees'>('builder');

    const fetchLines = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('budget_lines')
            .select('*')
            .eq('event_id', eventId)
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setLines(data as BudgetLine[]);
        }
        setLoading(false);
    }, [eventId, workspaceId]);

    useEffect(() => {
        fetchLines();
    }, [fetchLines]);

    // Totals
    const totalEstimated = lines.reduce((s, l) => s + (l.estimated || 0), 0);
    const totalCommitted = lines.reduce((s, l) => s + (l.committed || 0), 0);
    const totalActual = lines.reduce((s, l) => s + (l.actual || 0), 0);
    const variance = totalEstimated - totalActual;
    const variancePct = totalEstimated > 0 ? ((variance / totalEstimated) * 100) : 0;

    // Net payable per line: actual + GST - TDS
    const netPayable = (line: BudgetLine) => {
        const base = line.actual || 0;
        const gst = base * ((line.gst_rate || 0) / 100);
        const tds = base * ((line.tds_rate || 0) / 100);
        return base + gst - tds;
    };

    const handleAdd = async () => {
        setSaving('new');
        const { data, error } = await supabase.from('budget_lines').insert({
            workspace_id: workspaceId,
            event_id: eventId,
            category: 'Miscellaneous',
            description: '',
            estimated: 0,
            committed: 0,
            actual: 0,
            gst_rate: 18,
            tds_rate: 0
        }).select().single();

        if (!error && data) {
            setLines(prev => [...prev, data as BudgetLine]);
        }
        setSaving(null);
    };

    const handleDelete = async (id: string) => {
        setSaving(id);
        const { error } = await supabase.from('budget_lines').delete().eq('id', id);
        if (!error) {
            setLines(prev => prev.filter(l => l.id !== id));
        }
        setSaving(null);
    };

    const startEdit = (id: string, field: string, currentValue: string | number) => {
        setEditingCell({ id, field });
        setEditValue(String(currentValue ?? ''));
    };

    const commitEdit = async () => {
        if (!editingCell) return;
        const { id, field } = editingCell;
        const isNumeric = ['estimated', 'committed', 'actual', 'gst_rate', 'tds_rate'].includes(field);
        const value = isNumeric ? parseFloat(editValue) || 0 : editValue;

        setSaving(id);
        const { error } = await supabase
            .from('budget_lines')
            .update({ [field]: value, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (!error) {
            setLines(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
        }
        setEditingCell(null);
        setSaving(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') commitEdit();
        if (e.key === 'Escape') setEditingCell(null);
    };

    // Category breakdown for donut
    const categoryTotals = CATEGORIES.map(cat => ({
        category: cat,
        total: lines.filter(l => l.category === cat).reduce((s, l) => s + (l.actual || l.estimated || 0), 0),
        color: CATEGORY_COLORS[cat] || '#B2BEC3'
    })).filter(c => c.total > 0);

    const grandTotal = categoryTotals.reduce((s, c) => s + c.total, 0);

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/5 w-fit">
                <button
                    onClick={() => setBudgetView('builder')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        budgetView === 'builder' ? "bg-white text-[#1a1a1a] shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Budget Lines
                </button>
                <button
                    onClick={() => setBudgetView('tax')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        budgetView === 'tax' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    GST & TDS Report
                </button>
                <button
                    onClick={() => setBudgetView('alerts')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        budgetView === 'alerts' ? "bg-accent-pink text-white shadow-lg shadow-accent-pink/20" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    AI Alerts
                </button>
                <button
                    onClick={() => setBudgetView('sponsors')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        budgetView === 'sponsors' ? "bg-accent-yellow text-white shadow-lg shadow-accent-yellow/20" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Sponsors
                </button>
                <button
                    onClick={() => setBudgetView('fees')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        budgetView === 'fees' ? "bg-accent-green text-white shadow-lg shadow-accent-green/20" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Platform Fees
                </button>
            </div>

            {budgetView === 'tax' ? (
                <TaxTracker lines={lines} />
            ) : budgetView === 'alerts' ? (
                <BudgetAlerts eventId={eventId} workspaceId={workspaceId} />
            ) : budgetView === 'sponsors' ? (
                <SponsorshipTracker eventId={eventId} workspaceId={workspaceId} />
            ) : budgetView === 'fees' ? (
                <PlatformFeeCalculator data={{ ticketRevenue: totalActual * 0.6, vendorBookings: totalActual * 0.4 }} />
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SummaryCard
                            label="Estimated"
                            value={totalEstimated}
                            icon={PieChart}
                            color="bg-accent-blue/10 text-accent-blue"
                        />
                        <SummaryCard
                            label="Committed"
                            value={totalCommitted}
                            icon={Save}
                            color="bg-accent-yellow/10 text-accent-yellow"
                        />
                        <SummaryCard
                            label="Actual Spend"
                            value={totalActual}
                            icon={IndianRupee}
                            color="bg-accent-pink/10 text-accent-pink"
                        />
                        <div className={cn(
                            "intelly-card p-8 flex flex-col justify-between relative overflow-hidden",
                            variance >= 0 ? "accent-card-green" : "accent-card-pink"
                        )}>
                            <div className="flex items-center gap-3 mb-2">
                                {variance >= 0
                                    ? <TrendingDown className="h-5 w-5 opacity-60" />
                                    : <TrendingUp className="h-5 w-5 opacity-60" />}
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                    {variance >= 0 ? 'Under Budget' : 'Over Budget'}
                                </span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter italic">{formatCurrency(Math.abs(variance))}</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">
                                {variancePct >= 0 ? '+' : ''}{variancePct.toFixed(1)}% vs estimated
                            </span>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    {categoryTotals.length > 0 && (
                        <div className="intelly-card p-8">
                            <h3 className="text-lg font-black tracking-tighter uppercase italic mb-6">Category Breakdown</h3>
                            <div className="flex items-center gap-8">
                                {/* Bar chart */}
                                <div className="flex-1 space-y-3">
                                    {categoryTotals.map(cat => (
                                        <div key={cat.category} className="flex items-center gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest w-40 text-right opacity-60 truncate">{cat.category}</span>
                                            <div className="flex-1 h-4 bg-muted/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${grandTotal > 0 ? (cat.total / grandTotal * 100) : 0}%`,
                                                        backgroundColor: cat.color
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs font-black min-w-[80px]">{formatCurrency(cat.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Budget Table */}
                    <div className="intelly-card overflow-hidden">
                        <div className="flex items-center justify-between p-8 pb-0">
                            <h3 className="text-lg font-black tracking-tighter uppercase italic">Line Items</h3>
                            <button
                                onClick={handleAdd}
                                disabled={saving === 'new'}
                                className="h-10 px-6 bg-[#1a1a1a] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-transform disabled:opacity-50"
                            >
                                {saving === 'new' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                                Add Line
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm mt-6">
                                <thead>
                                    <tr className="border-b border-border/10">
                                        {['Category', 'Description', 'Estimated', 'Committed', 'Actual', 'GST %', 'TDS %', 'Net Payable', ''].map(h => (
                                            <th key={h} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4 text-left">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {lines.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-3 opacity-30">
                                                    <AlertCircle className="h-8 w-8" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">No budget lines yet — add one above</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {lines.map(line => (
                                        <tr key={line.id} className="border-b border-border/5 hover:bg-muted/30 transition-colors group">
                                            {/* Category (dropdown) */}
                                            <td className="px-6 py-4">
                                                {editingCell?.id === line.id && editingCell?.field === 'category' ? (
                                                    <select
                                                        autoFocus
                                                        value={editValue}
                                                        onChange={(e) => {
                                                            setEditValue(e.target.value);
                                                            // commit immediately on select
                                                            const val = e.target.value;
                                                            setEditingCell(null);
                                                            setSaving(line.id);
                                                            supabase.from('budget_lines').update({ category: val }).eq('id', line.id).then(() => {
                                                                setLines(prev => prev.map(l => l.id === line.id ? { ...l, category: val } : l));
                                                                setSaving(null);
                                                            });
                                                        }}
                                                        onBlur={() => setEditingCell(null)}
                                                        className="bg-white border border-primary rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
                                                    >
                                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(line.id, 'category', line.category)}
                                                        className="flex items-center gap-2 group/cat"
                                                    >
                                                        <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[line.category] || '#B2BEC3' }} />
                                                        <span className="text-xs font-bold truncate max-w-[140px] group-hover/cat:text-primary transition-colors">{line.category}</span>
                                                    </button>
                                                )}
                                            </td>

                                            {/* Description */}
                                            <EditableCell
                                                lineId={line.id}
                                                field="description"
                                                value={line.description || ''}
                                                editingCell={editingCell}
                                                editValue={editValue}
                                                onStartEdit={startEdit}
                                                onEditValueChange={setEditValue}
                                                onCommit={commitEdit}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Add note..."
                                            />

                                            {/* Numeric columns */}
                                            {(['estimated', 'committed', 'actual'] as const).map(field => (
                                                <EditableCell
                                                    key={field}
                                                    lineId={line.id}
                                                    field={field}
                                                    value={line[field]}
                                                    editingCell={editingCell}
                                                    editValue={editValue}
                                                    onStartEdit={startEdit}
                                                    onEditValueChange={setEditValue}
                                                    onCommit={commitEdit}
                                                    onKeyDown={handleKeyDown}
                                                    isCurrency
                                                />
                                            ))}

                                            {/* GST & TDS */}
                                            {(['gst_rate', 'tds_rate'] as const).map(field => (
                                                <EditableCell
                                                    key={field}
                                                    lineId={line.id}
                                                    field={field}
                                                    value={line[field]}
                                                    editingCell={editingCell}
                                                    editValue={editValue}
                                                    onStartEdit={startEdit}
                                                    onEditValueChange={setEditValue}
                                                    onCommit={commitEdit}
                                                    onKeyDown={handleKeyDown}
                                                    suffix="%"
                                                />
                                            ))}

                                            {/* Net Payable (computed, read-only) */}
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-black text-primary">{formatCurrency(netPayable(line))}</span>
                                            </td>

                                            {/* Delete */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleDelete(line.id)}
                                                    disabled={saving === line.id}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    {saving === line.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {lines.length > 0 && (
                                    <tfoot>
                                        <tr className="border-t-2 border-border/20 bg-muted/20">
                                            <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest" colSpan={2}>Totals</td>
                                            <td className="px-6 py-4 text-xs font-black">{formatCurrency(totalEstimated)}</td>
                                            <td className="px-6 py-4 text-xs font-black">{formatCurrency(totalCommitted)}</td>
                                            <td className="px-6 py-4 text-xs font-black">{formatCurrency(totalActual)}</td>
                                            <td colSpan={2} />
                                            <td className="px-6 py-4 text-xs font-black text-primary">
                                                {formatCurrency(lines.reduce((s, l) => s + netPayable(l), 0))}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

/* ──────────── Sub-components ──────────── */

const SummaryCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
    <div className="intelly-card p-8 flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
            <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
        </div>
        <h2 className="text-3xl font-black tracking-tighter italic">{formatCurrency(value)}</h2>
    </div>
);

const EditableCell = ({
    lineId, field, value, editingCell, editValue,
    onStartEdit, onEditValueChange, onCommit, onKeyDown,
    isCurrency, suffix, placeholder
}: {
    lineId: string;
    field: string;
    value: string | number;
    editingCell: { id: string; field: string } | null;
    editValue: string;
    onStartEdit: (id: string, field: string, val: string | number) => void;
    onEditValueChange: (val: string) => void;
    onCommit: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    isCurrency?: boolean;
    suffix?: string;
    placeholder?: string;
}) => {
    const isEditing = editingCell?.id === lineId && editingCell?.field === field;

    return (
        <td className="px-6 py-4">
            {isEditing ? (
                <input
                    autoFocus
                    type={isCurrency || suffix ? 'number' : 'text'}
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                    onBlur={onCommit}
                    onKeyDown={onKeyDown}
                    className="bg-white border border-primary rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 w-full max-w-[120px]"
                    placeholder={placeholder}
                />
            ) : (
                <button
                    onClick={() => onStartEdit(lineId, field, value)}
                    className="text-xs font-bold hover:text-primary transition-colors text-left w-full truncate"
                >
                    {isCurrency
                        ? formatCurrency(Number(value) || 0)
                        : suffix
                            ? `${value}${suffix}`
                            : (value || <span className="opacity-20 italic">{placeholder || '—'}</span>)
                    }
                </button>
            )}
        </td>
    );
};
