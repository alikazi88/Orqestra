import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
    X,
    Save,
    Trash2,
    User,
    Mail,
    Phone,
    Building2,
    Briefcase,
    Utensils,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GuestProfileModalProps {
    guest: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export const GuestProfileModal = ({ guest, isOpen, onClose, onUpdate }: GuestProfileModalProps) => {
    const [formData, setFormData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (guest) {
            setFormData({
                name: guest.name,
                email: guest.email || '',
                phone: guest.phone || '',
                tier: guest.tier || 'general',
                rsvp_status: guest.rsvp_status || 'pending',
                dietary: guest.dietary || '',
                company: guest.metadata?.company || '',
                designation: guest.metadata?.designation || ''
            });
        }
    }, [guest]);

    if (!isOpen || !formData) return null;

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('guests')
                .update({
                    name: formData.name,
                    email: formData.email || null,
                    phone: formData.phone || null,
                    tier: formData.tier,
                    rsvp_status: formData.rsvp_status,
                    dietary: formData.dietary || null,
                    metadata: {
                        ...guest.metadata,
                        company: formData.company,
                        designation: formData.designation
                    }
                })
                .eq('id', guest.id);

            if (updateError) throw updateError;

            onUpdate();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this guest from the event?')) return;

        setIsDeleting(true);
        try {
            const { error: deleteError } = await supabase
                .from('guests')
                .delete()
                .eq('id', guest.id);

            if (deleteError) throw deleteError;

            onUpdate();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

            <Card className="relative h-full w-full max-w-md bg-white shadow-2xl rounded-none md:rounded-l-[40px] overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
                {/* Header */}
                <div className="p-8 border-b border-border/40 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight">{formData.name || 'Guest Profile'}</h2>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Guest Management</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {error && (
                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-2">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Personal Details</h3>
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold ml-1">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-muted/30 border-none h-12 rounded-xl font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold ml-1 flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" /> Email
                                    </label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-muted/30 border-none h-12 rounded-xl font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold ml-1 flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5" /> Phone
                                    </label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-muted/30 border-none h-12 rounded-xl font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Segmentation */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Event Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold ml-1">Tier</label>
                                <select
                                    className="w-full h-12 bg-muted/30 border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none"
                                    value={formData.tier}
                                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                >
                                    <option value="vip">VIP</option>
                                    <option value="trade">Trade</option>
                                    <option value="press">Press</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold ml-1">RSVP</label>
                                <select
                                    className="w-full h-12 bg-muted/30 border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none"
                                    value={formData.rsvp_status}
                                    onChange={(e) => setFormData({ ...formData, rsvp_status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="declined">Declined</option>
                                    <option value="waitlisted">Waitlisted</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Professional Metadata */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Professional Info</h3>
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold ml-1 flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" /> Company
                                </label>
                                <Input
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="bg-muted/30 border-none h-12 rounded-xl font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold ml-1 flex items-center gap-1.5">
                                    <Briefcase className="h-3.5 w-3.5" /> Designation
                                </label>
                                <Input
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    className="bg-muted/30 border-none h-12 rounded-xl font-medium"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="space-y-4 pb-12">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Additional Info</h3>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold ml-1 flex items-center gap-1.5">
                                <Utensils className="h-3.5 w-3.5" /> Dietary Requirements
                            </label>
                            <textarea
                                className="w-full min-h-[100px] bg-muted/30 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="e.g. Vegan, Gluten-free, Nut allergies..."
                                value={formData.dietary}
                                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                            />
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-border/40 bg-muted/20 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className="h-14 w-14 p-0 rounded-2xl text-red-500 hover:bg-red-500/10"
                        onClick={handleDelete}
                        disabled={isDeleting || isSaving}
                    >
                        {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </Button>
                    <Button
                        className="flex-1 h-14 rounded-2xl font-black text-lg bg-primary shadow-xl shadow-primary/20 group"
                        onClick={handleSave}
                        disabled={isSaving || isDeleting}
                    >
                        {isSaving ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <Save className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                        )}
                        Update Guest
                    </Button>
                </div>
            </Card>
        </div>
    );
};
