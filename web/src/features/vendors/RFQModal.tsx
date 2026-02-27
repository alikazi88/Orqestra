import React, { useState } from 'react';
import { X, Calendar, MessageSquare, Sparkles, Send, Loader2, IndianRupee, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

interface RFQModalProps {
    vendor: any;
    isOpen: boolean;
    onClose: () => void;
    onSubmitted: (rfq: any) => void;
}

export const RFQModal = ({ vendor, isOpen, onClose, onSubmitted }: RFQModalProps) => {
    const { workspace } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        date: '',
        guestCount: '',
        budgetLimit: '',
        requirements: '',
        aiHelp: true
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workspace?.id) {
            setError('Please select a workspace first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: functionError } = await supabase.functions.invoke('whatsapp-dispatch', {
                body: {
                    vendorId: vendor.id,
                    workspaceId: workspace.id,
                    eventId: null, // Optional for now
                    data: formData
                }
            });

            if (functionError) throw functionError;

            setSuccess(true);
            onSubmitted({ ...formData, vendorId: vendor.id, rfqId: data.rfqId });

            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 3000);

        } catch (err: any) {
            console.error('RFQ Submission Error:', err);
            setError(err.message || 'Failed to send RFQ. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-[40px] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {success ? (
                    <div className="p-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-2">RFQ Dispatched!</h2>
                            <p className="text-muted-foreground font-medium">
                                We've sent your brief to <span className="font-bold text-primary">{vendor.name}</span> via WhatsApp.
                                You'll be notified as soon as they reply.
                            </p>
                        </div>
                        <Button onClick={onClose} className="w-full h-12 rounded-2xl">Done</Button>
                    </div>
                ) : (
                    <>
                        <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <MessageSquare className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-foreground">Request For Quote</h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">Sending brief to <span className="font-bold text-primary">{vendor.name}</span></p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
                                    {error}
                                </div>
                            )}

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
                                    label="Max Budget"
                                    placeholder="₹0.00"
                                    value={formData.budgetLimit}
                                    onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                                    icon={<IndianRupee className="h-4 w-4" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Special Requirements</label>
                                <textarea
                                    rows={4}
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    className="w-full bg-muted/30 border border-border rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    placeholder="Tell the vendor about your specific needs..."
                                />
                            </div>

                            <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-xs font-black text-primary uppercase tracking-tighter">AI Brief Optimizer</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, aiHelp: !formData.aiHelp })}
                                        className={cn(
                                            "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                                            formData.aiHelp ? "bg-primary" : "bg-muted"
                                        )}
                                    >
                                        <span className={cn(
                                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            formData.aiHelp ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                                    {formData.aiHelp
                                        ? "Our AI will enhance your brief with industry-standard specs (technical AV riders, decor safety compliance, etc) to ensure faster vendor responses."
                                        : "The vendor will receive your basic requirements only."}
                                </p>
                            </div>

                            <Button type="submit" className="w-full h-14 text-sm font-black shadow-xl shadow-primary/20 flex gap-2" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Submitting to Vendor Hub...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit RFQ Package
                                    </>
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
