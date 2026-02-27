import { useState } from 'react';
import {
    Shield, FileText, AlertTriangle,
    CheckCircle2, Clock,
    Building2, Volume2, Flame, Utensils
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NOCItem {
    id: string;
    type: string;
    authority: string;
    icon: any;
    description: string;
    documents: string[];
    timeline: string;
    fee: string;
    status: 'not-started' | 'applied' | 'in-review' | 'approved' | 'rejected';
    notes: string;
}

const STATUS_CONFIG = {
    'not-started': { label: 'Not Started', color: 'text-muted-foreground', bg: 'bg-muted' },
    applied: { label: 'Applied', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
    'in-review': { label: 'In Review', color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
    approved: { label: 'Approved', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    rejected: { label: 'Rejected', color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
};

const DEFAULT_NOCS: NOCItem[] = [
    {
        id: '1', type: 'Police NOC', authority: 'Local Police Station / Commissioner', icon: Shield,
        description: 'Required for large gatherings (100+ guests). Application to local SHO with event details, guest count, and security arrangements.',
        documents: ['Application letter', 'Venue booking proof', 'Organizer ID', 'Guest list (approx count)', 'Security plan'],
        timeline: '7-15 working days', fee: '₹500 - ₹2,000', status: 'not-started', notes: ''
    },
    {
        id: '2', type: 'FSSAI License', authority: 'Food Safety & Standards Authority of India', icon: Utensils,
        description: 'Required if serving food. All caterers must have FSSAI registration. Temporary license for events serving 100+ guests.',
        documents: ['Caterer FSSAI registration', 'Menu list', 'Hygiene compliance declaration', 'Food handler health certificates'],
        timeline: '5-10 working days', fee: '₹100 - ₹5,000', status: 'not-started', notes: ''
    },
    {
        id: '3', type: 'Sound/Noise NOC', authority: 'Police + Local Municipal Authority', icon: Volume2,
        description: 'Required for amplified sound. Noise levels must comply with Noise Pollution Rules, 2000. Deadline: 10 PM (residential), 12 AM (commercial).',
        documents: ['Application for loudspeaker permission', 'Venue details', 'Sound system specifications', 'Duration & timing details'],
        timeline: '3-7 working days', fee: '₹200 - ₹1,000', status: 'not-started', notes: ''
    },
    {
        id: '4', type: 'Fire NOC', authority: 'Fire Department / Chief Fire Officer', icon: Flame,
        description: 'Mandatory for indoor venues with 200+ capacity. Fire safety equipment, exit routes, and emergency plan required.',
        documents: ['Venue floor plan with exit markings', 'Fire extinguisher certificates', 'Emergency evacuation plan', 'Electrical safety certificate'],
        timeline: '7-14 working days', fee: '₹1,000 - ₹5,000', status: 'not-started', notes: ''
    },
    {
        id: '5', type: 'Municipal Authority NOC', authority: 'Municipal Corporation / Panchayat', icon: Building2,
        description: 'Required for outdoor events on public/private land. Covers waste management, parking, road blockages.',
        documents: ['Application letter', 'Land owner consent', 'Waste management plan', 'Traffic management plan'],
        timeline: '10-20 working days', fee: '₹2,000 - ₹10,000', status: 'not-started', notes: ''
    },
];

export const NOCTaskGenerator = () => {
    const [nocs, setNocs] = useState<NOCItem[]>(DEFAULT_NOCS);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const updateStatus = (id: string, status: NOCItem['status']) => {
        setNocs(prev => prev.map(n => n.id === id ? { ...n, status } : n));
    };

    const updateNotes = (id: string, notes: string) => {
        setNocs(prev => prev.map(n => n.id === id ? { ...n, notes } : n));
    };

    const approved = nocs.filter(n => n.status === 'approved').length;
    const pending = nocs.filter(n => n.status !== 'approved' && n.status !== 'not-started').length;
    const notStarted = nocs.filter(n => n.status === 'not-started').length;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">NOC Task Generator</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Police · FSSAI · Sound · Fire · Municipal</p>
                </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-green opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Approved</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic text-accent-green">{approved}</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3.5 w-3.5 text-accent-yellow opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">In Progress</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic text-accent-yellow">{pending}</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-accent-pink opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Not Started</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic text-accent-pink">{notStarted}</span>
                </div>
            </div>

            {/* NOC Cards */}
            <div className="space-y-4">
                {nocs.map(noc => {
                    const Icon = noc.icon;
                    const isExpanded = expandedId === noc.id;
                    const statusCfg = STATUS_CONFIG[noc.status];

                    return (
                        <div key={noc.id} className="intelly-card overflow-hidden">
                            {/* Header */}
                            <div
                                className="p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/20 transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : noc.id)}
                            >
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black tracking-tight">{noc.type}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground">{noc.authority}</p>
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground">{noc.timeline}</span>
                                <select
                                    value={noc.status}
                                    onChange={(e) => { e.stopPropagation(); updateStatus(noc.id, e.target.value as NOCItem['status']); }}
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn("text-[9px] font-black uppercase tracking-widest rounded-lg px-2.5 py-1.5 border-0 focus:ring-1 focus:ring-primary/20", statusCfg.bg, statusCfg.color)}
                                >
                                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                        <option key={k} value={k}>{v.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-5 pb-5 border-t border-border/5 space-y-4">
                                    <p className="text-xs font-medium text-muted-foreground pt-4">{noc.description}</p>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block mb-2">Required Documents</span>
                                        <div className="space-y-1.5">
                                            {noc.documents.map(doc => (
                                                <div key={doc} className="flex items-center gap-2">
                                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-[10px] font-medium">{doc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block mb-1">Timeline</span>
                                            <span className="text-xs font-bold">{noc.timeline}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block mb-1">Estimated Fee</span>
                                            <span className="text-xs font-bold">{noc.fee}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block mb-1">Notes</span>
                                        <textarea
                                            value={noc.notes}
                                            onChange={(e) => updateNotes(noc.id, e.target.value)}
                                            placeholder="Add notes about this NOC application..."
                                            className="w-full h-16 text-xs font-medium bg-muted/30 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
                                        />
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
