import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, IndianRupee, Loader2, Sparkles } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BlueprintReview } from './BlueprintReview';
import { cn } from '../../utils/cn';

interface NewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (event: any) => void;
}

export const NewEventModal = ({ isOpen, onClose, onCreated }: NewEventModalProps) => {
    const [loading, setLoading] = useState(false);
    const [useAI, setUseAI] = useState(true);
    const [blueprint, setBlueprint] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        city: '',
        budget: '',
        guestCount: '',
        type: 'corporate'
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate AI generation call to Edge Function
        setTimeout(() => {
            const mockBlueprint = {
                summary: `A high-impact corporate event in ${formData.city} for ${formData.guestCount} guests.`,
                tasks: [
                    { title: 'Secure Venue in ' + formData.city, priority: 'critical', daysOffset: -90 },
                    { title: 'Finalize F&B Menu', priority: 'medium', daysOffset: -45 },
                    { title: 'Send Speaker Invites', priority: 'high', daysOffset: -60 },
                    { title: 'Launch Registrations', priority: 'high', daysOffset: -75 },
                ],
                budgetLines: [
                    { category: 'Venue & Infrastructure', estimated: parseFloat(formData.budget || '100000') * 0.4 },
                    { category: 'Food & Beverage', estimated: parseFloat(formData.budget || '100000') * 0.25 },
                    { category: 'Tech & AV', estimated: parseFloat(formData.budget || '100000') * 0.35 },
                ],
                runSheet: [
                    { time: '08:00', title: 'Technical Soundcheck' },
                    { time: '09:00', title: 'Attendee Registration' },
                    { time: '10:00', title: 'Opening Plenary' },
                    { time: '13:00', title: 'Networking Lunch' },
                ]
            };
            setBlueprint(mockBlueprint);
            setLoading(false);
        }, 2000);
    };

    const handleConfirmBlueprint = () => {
        onCreated({ ...formData, blueprint });
        onClose();
        setBlueprint(null);
    };

    if (blueprint) {
        return (
            <BlueprintReview
                blueprint={blueprint}
                onConfirm={handleConfirmBlueprint}
                onCancel={() => setBlueprint(null)}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-[40px] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                    <div>
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Prepare New Event</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Define your core vision to start blueprinting.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <Input
                        label="Event Title"
                        placeholder="e.g. Summer Tech Summit 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="h-12"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Event Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            icon={<Calendar className="h-4 w-4" />}
                            required
                        />
                        <Input
                            label="Host City"
                            placeholder="Mumbai, IN"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            icon={<MapPin className="h-4 w-4" />}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Est. Budget"
                            placeholder="₹0.00"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            icon={<IndianRupee className="h-4 w-4" />}
                        />
                        <Input
                            label="Guest Count"
                            placeholder="e.g. 500"
                            value={formData.guestCount}
                            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                            icon={<Users className="h-4 w-4" />}
                        />
                    </div>

                    <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-bold text-primary tracking-tight">AI Blueprinting</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setUseAI(!useAI)}
                                className={cn(
                                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                                    useAI ? "bg-primary" : "bg-muted"
                                )}
                            >
                                <span className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                    useAI ? "translate-x-5" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {useAI
                                ? "Our AI Oracle will generate a complete Run Sheet, Budget Breakdown, and Task List tailored to your workspace profile."
                                : "You'll start with a blank event canvas and handle all planning manually."}
                        </p>
                    </div>

                    <Button type="submit" className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Consulting AI Oracle...</span>
                            </div>
                        ) : 'Launch Event Command Center'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
