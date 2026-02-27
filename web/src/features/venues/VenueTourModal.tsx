import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
    X,
    Camera,
    MapPin,
    Calendar as CalendarIcon,
    Clock,
    User,
    Mail,
    Phone,
    CheckCircle2,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

interface VenueTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    venue: {
        id: string;
        name: string;
        city: string;
    };
    initialType?: 'virtual' | 'physical';
}

export const VenueTourModal = ({ isOpen, onClose, venue, initialType = 'virtual' }: VenueTourModalProps) => {
    const { user, workspace } = useAuthStore();
    const [step, setStep] = useState(1);
    const [type, setType] = useState<'virtual' | 'physical'>(initialType);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!user || !workspace) return;

        setLoading(true);
        try {
            const scheduledAt = new Date(`${date}T${time}:00`);

            const { error } = await supabase
                .from('venue_tours' as any)
                .insert({
                    workspace_id: workspace.id,
                    venue_id: venue.id,
                    user_id: user.id,
                    type,
                    scheduled_at: scheduledAt.toISOString(),
                    status: 'requested',
                    notes: `Tour requested for ${venue.name}`
                } as any);

            if (error) throw error;
            setSuccess(true);
        } catch (err) {
            console.error('Error scheduling tour:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <Card className="w-full max-w-md p-10 flex flex-col items-center text-center gap-6 shadow-2xl border-white/20 bg-white/95 backdrop-blur-xl">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                        <CheckCircle2 className="h-10 w-10 animate-in zoom-in-50 duration-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">Request Sent!</h3>
                        <p className="text-muted-foreground font-medium">
                            Our team will confirm your {type} tour for <span className="text-foreground font-bold">{venue.name}</span> shortly.
                        </p>
                    </div>
                    <div className="w-full p-4 rounded-2xl bg-muted/50 border border-border text-left space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <CalendarIcon className="h-3 w-3" /> Scheduled For
                        </div>
                        <p className="font-bold">{new Date(date).toLocaleDateString()} at {time}</p>
                    </div>
                    <Button onClick={onClose} className="w-full h-12 rounded-xl font-bold">
                        Back to Venue
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-2xl overflow-hidden shadow-2xl border-white/20 bg-white/95 backdrop-blur-xl flex flex-col md:flex-row h-[500px]">
                {/* Left Sidebar: Context */}
                <div className="w-full md:w-1/3 bg-muted p-8 flex flex-col justify-between hidden md:flex">
                    <div>
                        <Badge variant="info" className="mb-4 bg-primary/10 text-primary border-primary/20 font-bold px-3">TOUR FLOW</Badge>
                        <h2 className="text-2xl font-black tracking-tight mb-2">Schedule Your Visit</h2>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            {step === 1 ? "Choose how you'd like to explore the space." :
                                step === 2 ? "Pick a slot that works for your team." :
                                    "Confirm your contact details for the invitation."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={cn(
                                    "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter transition-all",
                                    step >= s ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-muted-foreground/20 text-muted-foreground"
                                )}>
                                    {s}
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase font-bold tracking-widest",
                                    step >= s ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {s === 1 ? 'Tour Type' : s === 2 ? 'Scheduling' : 'Contact'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 p-8 flex flex-col relative">
                    <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex-1 mt-4">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <button
                                    onClick={() => setType('virtual')}
                                    className={cn(
                                        "w-full p-6 rounded-[28px] border-2 text-left transition-all group",
                                        type === 'virtual' ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                            type === 'virtual' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                        )}>
                                            <Camera className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black">Virtual 360 Walkthrough</h4>
                                            <p className="text-xs text-muted-foreground font-medium">Live video tour with a site manager.</p>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setType('physical')}
                                    className={cn(
                                        "w-full p-6 rounded-[28px] border-2 text-left transition-all group",
                                        type === 'physical' ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                            type === 'physical' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                        )}>
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black">Physical Site Inspection</h4>
                                            <p className="text-xs text-muted-foreground font-medium">In-person walk through the venue.</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-3 block">Preferred Date</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full h-12 rounded-xl bg-muted/50 border border-border pl-12 pr-4 font-bold text-sm focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-3 block">Preferred Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full h-12 rounded-xl bg-muted/50 border border-border pl-12 pr-4 font-bold text-sm focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-bold">{useAuthStore.getState().profile?.full_name || user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-bold">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-bold text-muted-foreground italic">Add phone during confirmation</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed px-2 font-medium">
                                    By submitting, you agree to coordinate with the venue manager via the Orqestra messaging system.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex gap-3">
                        {step > 1 && (
                            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1 h-12 rounded-xl border-border/60 font-bold">
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button
                                onClick={() => setStep(s => s + 1)}
                                disabled={step === 2 && (!date || !time)}
                                className="flex-1 h-12 rounded-xl font-bold bg-foreground text-white group"
                            >
                                Next Step
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 h-12 rounded-xl font-bold shadow-xl shadow-primary/20"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Request
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
