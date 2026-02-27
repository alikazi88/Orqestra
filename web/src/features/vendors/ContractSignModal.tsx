import { useState } from 'react';
import { X, FileText, ShieldCheck, Send, PenTool, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SignaturePad } from '../../components/ui/SignaturePad';

interface ContractSignModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendor: any;
    event?: any;
    onSigned: (signatureData: string) => void;
}

export const ContractSignModal = ({ isOpen, onClose, vendor, event, onSigned }: ContractSignModalProps) => {
    const [step, setStep] = useState<'review' | 'sign' | 'confirm'>('review');
    const [signature, setSignature] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !vendor) return null;

    const handleSignatureSave = (dataUrl: string) => {
        setSignature(dataUrl);
        setStep('confirm');
    };

    const handleSubmit = async () => {
        if (!signature) return;
        setIsSubmitting(true);
        try {
            await onSigned(signature);
            // In a real scenario, this would wait for the Edge Function response
        } catch (error) {
            console.error('Signing error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" onClick={onClose} />

            <Card className="relative w-full max-w-2xl bg-white/50 border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-white">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground italic">Execute Agreement</h2>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">
                                {vendor.name} × Orqestra Smart Contract
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-muted/50 flex items-center justify-center transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto">
                    {step === 'review' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="info">Legally Binding</Badge>
                                    <Badge variant="success">Standard Terms</Badge>
                                </div>
                                {event && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        For: {event.name || 'Current Event'}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-sm text-foreground/80 max-w-none">
                                <h3 className="font-bold text-lg mb-2">1. Scope of Work</h3>
                                <p className="mb-4">
                                    The vendor agrees to provide {vendor.category} services for the event as specified in the RFQ and subsequent proposals.
                                    This includes setup, execution, and teardown as per the agreed timeline.
                                </p>

                                <h3 className="font-bold text-lg mb-2">2. Payment Terms</h3>
                                <p className="mb-4">
                                    Total commitment: <span className="font-black">₹{vendor.pricing_min.toLocaleString()} (Plus GST)</span>.
                                    A 25% deposit is required upon execution of this agreement. Remaining balance due T-7 days before event.
                                </p>

                                <h3 className="font-bold text-lg mb-2">3. Cancellation Policy</h3>
                                <p className="mb-4">
                                    Full refund if cancelled 30 days before event. 50% refund if cancelled 14 days before event.
                                    No refund if cancelled within 7 days of the event date.
                                </p>

                                <div className="p-6 rounded-2xl bg-muted/30 border border-border flex items-start gap-4">
                                    <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-bold text-sm">Orqestra Safe-Pay Guarantee</p>
                                        <p className="text-xs text-muted-foreground">
                                            Your payments are held in escrow and only released to the vendor upon successful milestone verification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'sign' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-primary/30">
                                    <PenTool className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-black italic">Capture Your Signature</h3>
                                <p className="text-sm text-muted-foreground font-medium">Draw your signature in the box below to execute the contract.</p>
                            </div>

                            <SignaturePad onSave={handleSignatureSave} />
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="space-y-8 text-center py-8">
                            <div className="relative mx-auto w-fit">
                                <img src={signature!} alt="Signature" className="h-32 bg-white border border-border rounded-xl px-4 py-2 mx-auto" />
                                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                    <Check className="h-4 w-4 stroke-[3]" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic mb-2">Review & Submit</h3>
                                <p className="text-sm text-muted-foreground font-medium">
                                    By clicking 'Submit & Generate PDF', you agree to the terms listed in the agreement.
                                    A signed copy will be sent to both parties.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 bg-muted/20 border-t border-border flex items-center justify-between">
                    {step === 'review' ? (
                        <>
                            <Button variant="outline" onClick={onClose} className="rounded-xl px-8 h-12">Cancel</Button>
                            <Button variant="primary" onClick={() => setStep('sign')} className="rounded-xl px-10 h-12 font-black gap-2 shadow-xl shadow-primary/20">
                                Proceed to Sign
                                <PenTool className="h-4 w-4" />
                            </Button>
                        </>
                    ) : step === 'sign' ? (
                        <>
                            <Button variant="outline" onClick={() => setStep('review')} className="rounded-xl px-8 h-12">Back to Terms</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setStep('sign')} className="rounded-xl px-8 h-12">Redo Signature</Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                isLoading={isSubmitting}
                                className="rounded-xl px-10 h-12 font-black gap-2 shadow-xl shadow-primary/20"
                            >
                                <Send className="h-4 w-4" />
                                Submit & Generate PDF
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};
