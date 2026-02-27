import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    X,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';

interface CSVImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    eventId: string;
    workspaceId: string;
}

interface Mapping {
    csvHeader: string;
    dbColumn: string;
}

export const CSVImportModal = ({ isOpen, onClose, onComplete, eventId, workspaceId }: CSVImportModalProps) => {
    const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'ingesting'>('upload');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dbColumns = [
        { key: 'name', label: 'Full Name', required: true },
        { key: 'email', label: 'Email Address', required: false },
        { key: 'phone', label: 'Phone Number', required: false },
        { key: 'company', label: 'Company/Organization', required: false },
        { key: 'designation', label: 'Job Title', required: false },
    ];

    if (!isOpen) return null;

    const handleFileUpload = (file: File) => {
        if (!file.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data.length === 0) {
                    setError('The CSV file appears to be empty.');
                    return;
                }
                setCsvData(results.data);
                const csvHeaders = Object.keys(results.data[0]);
                setHeaders(csvHeaders);

                // Auto-map based on header names
                const initialMappings: Mapping[] = [];
                csvHeaders.forEach(header => {
                    const normalized = header.toLowerCase().replace(/[^a-z]/g, '');
                    if (normalized.includes('name')) initialMappings.push({ csvHeader: header, dbColumn: 'name' });
                    else if (normalized.includes('email')) initialMappings.push({ csvHeader: header, dbColumn: 'email' });
                    else if (normalized.includes('phone') || normalized.includes('mobile')) initialMappings.push({ csvHeader: header, dbColumn: 'phone' });
                    else if (normalized.includes('company') || normalized.includes('org')) initialMappings.push({ csvHeader: header, dbColumn: 'company' });
                    else if (normalized.includes('title') || normalized.includes('job') || normalized.includes('designation')) initialMappings.push({ csvHeader: header, dbColumn: 'designation' });
                });
                setMappings(initialMappings);
                setStep('map');
                setError(null);
            },
            error: (err) => {
                setError(`Failed to parse CSV: ${err.message}`);
            }
        });
    };

    const handleIngest = async () => {
        setStep('ingesting');

        try {
            const formattedGuests = csvData.map(row => {
                const guest: any = {
                    event_id: eventId,
                    workspace_id: workspaceId,
                    metadata: {}
                };

                mappings.forEach(m => {
                    if (['name', 'email', 'phone'].includes(m.dbColumn)) {
                        guest[m.dbColumn] = row[m.csvHeader];
                    } else {
                        guest.metadata[m.dbColumn] = row[m.csvHeader];
                    }
                });

                guest.rsvp_status = 'pending';
                guest.tier = 'general';

                return guest;
            });

            const { error: ingestError } = await supabase
                .from('guests')
                .insert(formattedGuests);

            if (ingestError) throw ingestError;

            onComplete();
            onClose();
        } catch (err: any) {
            setError(`Ingestion failed: ${err.message}`);
            setStep('preview');
        }
    };

    const updateMapping = (dbColumn: string, csvHeader: string) => {
        setMappings(prev => {
            const filtered = prev.filter(m => m.dbColumn !== dbColumn);
            if (csvHeader === 'none') return filtered;
            return [...filtered, { csvHeader, dbColumn }];
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <Card className="relative w-full max-w-3xl bg-white shadow-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-border/40 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Import Guest List</h2>
                        <p className="text-sm text-muted-foreground font-medium">Add guests to your event via CSV upload</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {step === 'upload' && (
                        <div
                            className={cn(
                                "h-80 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all",
                                isDragging ? "border-primary bg-primary/5 scale-[0.98]" : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                            )}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files[0]); }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                            />
                            <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold">Drag & drop your CSV file here</p>
                                <p className="text-sm text-muted-foreground font-medium">or click to browse from your computer</p>
                            </div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Supported: .CSV only</p>
                        </div>
                    )}

                    {step === 'map' && (
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-6 rounded-3xl border border-border/40">
                                <h3 className="font-bold flex items-center gap-2 mb-1">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Map your columns
                                </h3>
                                <p className="text-xs text-muted-foreground font-medium">Match the columns from your CSV to the Orqestra guest profile.</p>
                            </div>

                            <div className="space-y-4">
                                {dbColumns.map((col) => {
                                    const mapping = mappings.find(m => m.dbColumn === col.key);
                                    return (
                                        <div key={col.key} className="flex items-center gap-6 p-4 rounded-2xl border border-border/40 hover:bg-muted/20 transition-colors">
                                            <div className="w-1/3">
                                                <p className="font-bold text-sm">
                                                    {col.label}
                                                    {col.required && <span className="text-red-500 ml-1">*</span>}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex-1">
                                                <select
                                                    className="w-full h-11 bg-white border border-border/60 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    value={mapping?.csvHeader || 'none'}
                                                    onChange={(e) => updateMapping(col.key, e.target.value)}
                                                >
                                                    <option value="none">Ignore this column</option>
                                                    {headers.map(h => (
                                                        <option key={h} value={h}>{h}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Button
                                className="w-full h-12 rounded-2xl font-bold mt-4 shadow-xl shadow-primary/20"
                                disabled={!mappings.some(m => m.dbColumn === 'name')}
                                onClick={() => setStep('preview')}
                            >
                                Preview Guest List
                            </Button>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                <div>
                                    <h3 className="font-bold text-primary flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Ready for Ingestion
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium">We found {csvData.length} guest records in your file.</p>
                                </div>
                                <Button variant="outline" className="h-10 text-xs font-bold" onClick={() => setStep('map')}>
                                    Edit Mapping
                                </Button>
                            </div>

                            <div className="border border-border/40 rounded-3xl overflow-hidden max-h-80 overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-muted/50 sticky top-0">
                                        <tr className="border-b border-border/40">
                                            {mappings.map(m => (
                                                <th key={m.dbColumn} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {dbColumns.find(c => c.key === m.dbColumn)?.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/20">
                                        {csvData.slice(0, 10).map((row, i) => (
                                            <tr key={i} className="hover:bg-muted/10 transition-colors">
                                                {mappings.map(m => (
                                                    <td key={m.dbColumn} className="px-4 py-3 text-sm font-medium">{row[m.csvHeader]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {csvData.length > 10 && (
                                    <div className="p-4 text-center bg-muted/20 border-t border-border/20">
                                        <p className="text-xs text-muted-foreground font-medium">And {csvData.length - 10} more records...</p>
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full h-14 rounded-2xl font-black text-lg bg-primary shadow-2xl shadow-primary/40 group overflow-hidden"
                                onClick={handleIngest}
                            >
                                <span className="relative z-10">Ingest Guest List</span>
                                <div className="absolute inset-y-0 left-0 w-0 bg-white/20 group-hover:w-full transition-all duration-500 ease-out" />
                            </Button>
                        </div>
                    )}

                    {step === 'ingesting' && (
                        <div className="h-64 flex flex-col items-center justify-center gap-6">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold">Populating Guest List...</p>
                                <p className="text-sm text-muted-foreground font-medium">Encrypting and syncing {csvData.length} records to your private workspace.</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
