import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
    FileUp,
    MessageSquare,
    Database,
    ArrowRight,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface VendorImportProps {
    onNext: (data: any) => void;
    onBack: () => void;
}

const IMPORT_OPTIONS = [
    { id: 'whatsapp', label: 'WhatsApp Contacts', icon: MessageSquare, desc: 'Sync vendors from your WhatsApp Business logs', accent: 'bg-green-500' },
    { id: 'csv', label: 'CSV/Excel Upload', icon: FileUp, desc: 'Bulk import from your existing spreadsheets', accent: 'bg-blue-500' },
    { id: 'marketplace', label: 'Browse Orqestra', icon: Database, desc: 'Start fresh with our verified vendor list', accent: 'bg-primary' },
];

export const VendorImport = ({ onNext, onBack }: VendorImportProps) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImport = (id: string) => {
        setSelected(id);
        setLoading(true);
        // Real implementation would trigger actual import flow
        setTimeout(() => {
            onNext({ importMethod: id });
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                {IMPORT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => handleImport(opt.id)}
                            disabled={loading}
                            className="group block w-full text-left transition-transform active:scale-[0.99] disabled:opacity-70"
                        >
                            <Card className="p-6 flex items-center justify-between hover:border-primary/50 hover:shadow-premium transition-all">
                                <div className="flex items-center gap-5">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg", opt.accent)}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-0.5">{opt.label}</h4>
                                        <p className="text-sm text-muted-foreground">{opt.desc}</p>
                                    </div>
                                </div>
                                {loading && selected === opt.id ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                ) : (
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                                )}
                            </Card>
                        </button>
                    );
                })}
            </div>

            <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-sm text-primary">Trust Orqestra Integration</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        We never store your personal login credentials. Connections are made via secure OAuth 2.0 or encrypted file processing.
                    </p>
                </div>
            </div>

            <Button variant="outline" className="w-full h-14" onClick={onBack} disabled={loading}>
                Back to Event Types
            </Button>
        </div>
    );
};
