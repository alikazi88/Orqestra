import { useState } from 'react';
import {
    Package, CheckCircle2, Clock, Camera,
    AlertTriangle
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Deliverable {
    id: string;
    sponsor: string;
    tier: string;
    item: string;
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    evidenceUrl: string | null;
    dueDate: string;
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
    'in-progress': { label: 'In Progress', icon: Clock, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
    completed: { label: 'Completed', icon: CheckCircle2, color: 'text-accent-green', bg: 'bg-accent-green/10' },
    overdue: { label: 'Overdue', icon: AlertTriangle, color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
};

export const SponsorshipDeliverableTracker = () => {
    const [deliverables, setDeliverables] = useState<Deliverable[]>([
        { id: '1', sponsor: 'Tata Motors', tier: 'Title', item: 'Logo on main stage backdrop', status: 'completed', evidenceUrl: '/evidence/tata-backdrop.jpg', dueDate: '2026-02-15' },
        { id: '2', sponsor: 'Tata Motors', tier: 'Title', item: '3 social media posts with brand tag', status: 'in-progress', evidenceUrl: null, dueDate: '2026-03-01' },
        { id: '3', sponsor: 'Tata Motors', tier: 'Title', item: 'Branded welcome drink station', status: 'completed', evidenceUrl: '/evidence/tata-drinks.jpg', dueDate: '2026-02-20' },
        { id: '4', sponsor: 'HDFC Bank', tier: 'Gold', item: 'Logo on event invite', status: 'completed', evidenceUrl: '/evidence/hdfc-invite.jpg', dueDate: '2026-02-10' },
        { id: '5', sponsor: 'HDFC Bank', tier: 'Gold', item: 'Booth space at networking area', status: 'completed', evidenceUrl: '/evidence/hdfc-booth.jpg', dueDate: '2026-02-20' },
        { id: '6', sponsor: 'Zomato', tier: 'Silver', item: 'Logo on table tent cards', status: 'overdue', evidenceUrl: null, dueDate: '2026-02-18' },
        { id: '7', sponsor: 'Zomato', tier: 'Silver', item: 'QR code on event landing page', status: 'completed', evidenceUrl: '/evidence/zomato-qr.jpg', dueDate: '2026-02-15' },
        { id: '8', sponsor: 'WeWork', tier: 'In-kind', item: 'Venue co-branding signage', status: 'pending', evidenceUrl: null, dueDate: '2026-03-05' },
    ]);

    const updateStatus = (id: string, status: Deliverable['status']) => {
        setDeliverables(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    };

    const completed = deliverables.filter(d => d.status === 'completed').length;
    const overdue = deliverables.filter(d => d.status === 'overdue').length;
    const completionRate = deliverables.length > 0 ? Math.round((completed / deliverables.length) * 100) : 0;

    // Group by sponsor
    const sponsors = [...new Set(deliverables.map(d => d.sponsor))];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-accent-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <Package className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Sponsorship Deliverables</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Track & prove fulfillment with photo evidence</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Total</span>
                    <span className="text-3xl font-black tracking-tighter italic">{deliverables.length}</span>
                </div>
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Completed</span>
                    <span className="text-3xl font-black tracking-tighter italic text-accent-green">{completed}</span>
                </div>
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Overdue</span>
                    <span className="text-3xl font-black tracking-tighter italic text-accent-pink">{overdue}</span>
                </div>
                <div className="intelly-card p-5">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-1">Fulfillment</span>
                    <span className="text-3xl font-black tracking-tighter italic">{completionRate}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="intelly-card p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Overall Fulfillment</span>
                    <span className="text-sm font-black">{completionRate}%</span>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent-green to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${completionRate}%` }} />
                </div>
            </div>

            {/* By Sponsor */}
            {sponsors.map(sponsor => {
                const sponsorDeliverables = deliverables.filter(d => d.sponsor === sponsor);
                const sponsorTier = sponsorDeliverables[0]?.tier;

                return (
                    <div key={sponsor} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-black uppercase tracking-widest">{sponsor}</h3>
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">{sponsorTier}</span>
                        </div>

                        {sponsorDeliverables.map(d => {
                            const cfg = STATUS_CONFIG[d.status];

                            return (
                                <div key={d.id} className="intelly-card p-4 flex items-center gap-4">
                                    <select
                                        value={d.status}
                                        onChange={(e) => updateStatus(d.id, e.target.value as Deliverable['status'])}
                                        className={cn("text-[9px] font-black uppercase tracking-widest rounded-lg px-2.5 py-1.5 border-0 focus:ring-1 focus:ring-primary/20", cfg.bg, cfg.color)}
                                    >
                                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                            <option key={k} value={k}>{v.label}</option>
                                        ))}
                                    </select>

                                    <span className="text-xs font-medium flex-1">{d.item}</span>

                                    <span className="text-[9px] font-bold text-muted-foreground">
                                        Due {new Date(d.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </span>

                                    {d.evidenceUrl ? (
                                        <button className="h-7 px-3 rounded-lg bg-accent-green/10 text-accent-green text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <Camera className="h-2.5 w-2.5" /> Proof
                                        </button>
                                    ) : (
                                        <button className="h-7 px-3 rounded-lg bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors">
                                            <Camera className="h-2.5 w-2.5" /> Add Photo
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
