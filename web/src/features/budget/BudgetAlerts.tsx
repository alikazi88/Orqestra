import { useState, useEffect, useCallback } from 'react';
import {
    ArrowRight, TrendingDown,
    RefreshCw, Loader2, ShieldCheck,
    Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';

interface Alert {
    type: 'overspend' | 'underspend' | 'reallocation' | 'warning';
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    message: string;
    amount?: number;
    percentage?: number;
}

interface Reallocation {
    from_category: string;
    to_category: string;
    amount: number;
    reason: string;
}

interface BudgetSummary {
    total_estimated: number;
    total_committed: number;
    total_actual: number;
    variance: number;
    variance_pct: number;
    health: 'healthy' | 'warning' | 'critical';
    alert_count: number;
    reallocation_count: number;
}

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const severityColor: Record<string, string> = {
    low: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    medium: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20',
    high: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
    critical: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const severityIcon: Record<string, string> = {
    low: '💡',
    medium: '⚠️',
    high: '🔴',
    critical: '🚨',
};

export const BudgetAlerts = ({ eventId, workspaceId }: { eventId: string; workspaceId: string }) => {
    const [data, setData] = useState<{ alerts: Alert[]; reallocations: Reallocation[]; summary: BudgetSummary } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/budget-alerts`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ event_id: eventId, workspace_id: workspaceId }),
                }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to fetch alerts');
            }

            const result = await res.json();
            setData(result);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [eventId, workspaceId]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-accent-pink/10 rounded-2xl flex items-center justify-center rotate-3">
                        <Zap className="h-6 w-6 text-accent-pink" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tighter uppercase italic">AI Budget Analysis</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Automated overspend detection & reallocation suggestions</p>
                    </div>
                </div>
                <button
                    onClick={fetchAlerts}
                    disabled={loading}
                    className="h-10 px-5 bg-[#1a1a1a] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-2 hover:-translate-y-0.5 transition-transform disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    Refresh
                </button>
            </div>

            {loading && !data && (
                <div className="h-[200px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                </div>
            )}

            {error && (
                <div className="intelly-card p-8 border-red-500/20 bg-red-50/50">
                    <p className="text-sm font-bold text-red-600">{error}</p>
                </div>
            )}

            {data && (
                <>
                    {/* Health Badge */}
                    <div className={cn(
                        "intelly-card p-8 flex items-center gap-6",
                        data.summary.health === 'healthy' ? "accent-card-green" :
                            data.summary.health === 'warning' ? "accent-card-yellow" : "accent-card-pink"
                    )}>
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-white/10 text-3xl">
                            {data.summary.health === 'healthy' ? '✅' : data.summary.health === 'warning' ? '⚠️' : '🚨'}
                        </div>
                        <div>
                            <h4 className="text-2xl font-black tracking-tighter italic uppercase">{data.summary.health}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {data.summary.alert_count} alert{data.summary.alert_count !== 1 ? 's' : ''} · {data.summary.reallocation_count} reallocation{data.summary.reallocation_count !== 1 ? 's' : ''} suggested
                            </p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Variance</p>
                            <p className="text-2xl font-black tracking-tighter italic">
                                {data.summary.variance >= 0 ? '+' : ''}{formatCurrency(data.summary.variance)}
                            </p>
                        </div>
                    </div>

                    {/* Alerts */}
                    {data.alerts.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-widest opacity-50">Alerts</h4>
                            {data.alerts.map((alert, i) => (
                                <div key={i} className={cn("rounded-2xl p-6 border flex items-start gap-4", severityColor[alert.severity])}>
                                    <span className="text-xl">{severityIcon[alert.severity]}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/50">
                                                {alert.category}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50">
                                                {alert.type}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold">{alert.message}</p>
                                    </div>
                                    {alert.amount && (
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-lg font-black tracking-tighter">{formatCurrency(alert.amount)}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reallocation Suggestions */}
                    {data.reallocations.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase tracking-widest opacity-50">Reallocation Suggestions</h4>
                            {data.reallocations.map((r, i) => (
                                <div key={i} className="intelly-card p-6 flex items-center gap-6 hover:-translate-y-0.5 transition-transform">
                                    <div className="h-10 w-10 bg-accent-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <TrendingDown className="h-5 w-5 text-accent-green" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 text-sm font-black">
                                            <span className="bg-accent-green/10 text-accent-green px-3 py-1 rounded-lg text-xs">{r.from_category}</span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            <span className="bg-accent-pink/10 text-accent-pink px-3 py-1 rounded-lg text-xs">{r.to_category}</span>
                                        </div>
                                        <p className="text-[10px] font-bold opacity-50 mt-2">{r.reason}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xl font-black tracking-tighter text-primary">{formatCurrency(r.amount)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.alerts.length === 0 && data.reallocations.length === 0 && (
                        <div className="intelly-card p-12 text-center">
                            <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-accent-green opacity-40" />
                            <h4 className="text-lg font-black tracking-tighter uppercase italic mb-2">All Clear</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No budget issues detected — spending is on track</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
