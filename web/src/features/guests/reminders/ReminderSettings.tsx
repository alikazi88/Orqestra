import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
    Bell,
    Settings2,
    Send,
    History,
    Calendar,
    CheckCircle2,
    Loader2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { cn } from '../../../utils/cn';

interface ReminderSettingsProps {
    eventId: string;
    workspaceId: string;
}

interface ReminderLog {
    id: string;
    guest_name: string;
    reminder_type: string;
    sent_at: string;
    status: string;
}

export const ReminderSettings = ({ eventId, workspaceId }: ReminderSettingsProps) => {
    const [isSending, setIsSending] = useState(false);
    const [logs, setLogs] = useState<ReminderLog[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [config, setConfig] = useState({
        enabled: true,
        frequency_days: 3,
        max_reminders: 3,
        channels: ['email']
    });

    useEffect(() => {
        fetchLogs();
    }, [eventId]);

    const fetchLogs = async () => {
        setIsLoadingLogs(true);
        try {
            const { data, error } = await (supabase.from('guest_reminders') as any)
                .select(`
                    id,
                    sent_at,
                    reminder_type,
                    status,
                    guest:guests(name)
                `)
                .eq('event_id', eventId)
                .order('sent_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            const formattedLogs = (data as any[]).map(log => ({
                id: log.id,
                guest_name: log.guest?.name || 'Unknown',
                reminder_type: log.reminder_type,
                sent_at: log.sent_at,
                status: log.status
            }));

            setLogs(formattedLogs);
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    const handleManualTrigger = async () => {
        setIsSending(true);
        try {
            // Trigger Edge Function
            const { error: functionError } = await supabase.functions.invoke('rsvp-reminder-service', {
                body: { event_id: eventId, workspace_id: workspaceId, mode: 'manual' }
            });

            if (functionError) throw functionError;

            // Refresh logs
            setTimeout(fetchLogs, 2000);
        } catch (err) {
            console.error('Manual trigger failed:', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Bell className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Reminder Engine</h2>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-60">
                            Automated Guest Follow-ups
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => fetchLogs()}
                        className="rounded-xl border-border/60 font-bold h-12 px-6"
                    >
                        <History className="h-4 w-4 mr-2" /> History
                    </Button>
                    <Button
                        onClick={handleManualTrigger}
                        disabled={isSending}
                        className="rounded-xl font-bold h-12 px-8 shadow-xl shadow-primary/20"
                    >
                        {isSending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4 mr-2" />
                        )}
                        Manual Blast
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Card */}
                <Card className="lg:col-span-7 p-10 bg-white/50 backdrop-blur-md border-border/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Settings2 className="h-64 w-64" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                            Sequence Settings
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        </h3>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[24px] border border-primary/10">
                                <div>
                                    <p className="font-black text-sm uppercase tracking-wider mb-1">Engine Status</p>
                                    <p className="text-xs text-muted-foreground font-medium">Automatic background tracking is {config.enabled ? 'Active' : 'Paused'}</p>
                                </div>
                                <div
                                    className={cn(
                                        "h-8 w-14 rounded-full p-1 cursor-pointer transition-all duration-300",
                                        config.enabled ? "bg-primary" : "bg-muted"
                                    )}
                                    onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                                >
                                    <div className={cn(
                                        "h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300",
                                        config.enabled ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Frequency</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full h-14 bg-white/80 border-2 border-border/40 rounded-2xl px-5 font-black text-lg focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            value={config.frequency_days}
                                            onChange={(e) => setConfig(prev => ({ ...prev, frequency_days: parseInt(e.target.value) }))}
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-muted-foreground tracking-widest">Days</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium ml-1 italic">Wait time between nudges</p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Limit</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full h-14 bg-white/80 border-2 border-border/40 rounded-2xl px-5 font-black text-lg focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                            value={config.max_reminders}
                                            onChange={(e) => setConfig(prev => ({ ...prev, max_reminders: parseInt(e.target.value) }))}
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-muted-foreground tracking-widest">Tries</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium ml-1 italic">Max follow-ups per guest</p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                                    Apply Changes
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Activity Logs Sidebar */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <Card className="p-8 border-border/40 bg-white/50">
                        <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-6">
                            <History className="h-4 w-4 text-primary" />
                            Recent Activity
                        </h4>

                        <div className="space-y-4">
                            {isLoadingLogs ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary/20" />
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground opacity-40">
                                    <AlertCircle className="h-10 w-10 mx-auto mb-3" />
                                    <p className="text-xs font-bold uppercase tracking-wider">No reminders sent yet</p>
                                </div>
                            ) : (
                                logs.map(log => (
                                    <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border/40 group hover:border-primary/20 transition-all">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                                            log.status === 'sent' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {log.status === 'sent' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate tracking-tight">{log.guest_name}</p>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-wider mt-0.5">
                                                <span>{log.reminder_type} nudge</span>
                                                <span className="h-1 w-1 rounded-full bg-border" />
                                                <span>{new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card glass className="p-6 bg-primary/5 border-primary/10 border shadow-none">
                        <div className="flex items-center gap-3 mb-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest">Next Scheduled Run</span>
                        </div>
                        <p className="text-xl font-black tracking-tight">Today, 4:00 PM</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-60">Estimated 14 recipients</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
