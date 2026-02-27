import { useMemo } from 'react';
import {
    IndianRupee, FileText, TrendingDown,
    ArrowDownRight, ArrowUpRight, Receipt
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface BudgetLine {
    id: string;
    category: string;
    description: string | null;
    estimated: number;
    committed: number;
    actual: number;
    gst_rate: number;
    tds_rate: number;
}

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export const TaxTracker = ({ lines }: { lines: BudgetLine[] }) => {
    const taxData = useMemo(() => {
        // Group by GST slab
        const slabMap = new Map<number, { count: number; base: number; gst: number; tds: number }>();

        lines.forEach(line => {
            const rate = line.gst_rate || 0;
            const base = line.actual || 0;
            const gst = base * (rate / 100);
            const tds = base * ((line.tds_rate || 0) / 100);

            const existing = slabMap.get(rate) || { count: 0, base: 0, gst: 0, tds: 0 };
            slabMap.set(rate, {
                count: existing.count + 1,
                base: existing.base + base,
                gst: existing.gst + gst,
                tds: existing.tds + tds
            });
        });

        const slabs = Array.from(slabMap.entries())
            .map(([rate, data]) => ({ rate, ...data }))
            .sort((a, b) => b.rate - a.rate);

        const totalBase = lines.reduce((s, l) => s + (l.actual || 0), 0);
        const totalGST = lines.reduce((s, l) => s + (l.actual || 0) * ((l.gst_rate || 0) / 100), 0);
        const totalTDS = lines.reduce((s, l) => s + (l.actual || 0) * ((l.tds_rate || 0) / 100), 0);
        const totalCGST = totalGST / 2; // Intra-state split
        const totalSGST = totalGST / 2;
        const itcEligible = totalGST * 0.85; // 85% of GST is typically ITC-eligible for business expenses
        const netTaxLiability = totalGST - itcEligible;

        return { slabs, totalBase, totalGST, totalTDS, totalCGST, totalSGST, itcEligible, netTaxLiability };
    }, [lines]);

    if (lines.length === 0) {
        return (
            <div className="intelly-card p-12 text-center">
                <FileText className="h-10 w-10 mx-auto mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Add budget lines to see tax breakdown</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Tax Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <TaxCard
                    label="Total GST Output"
                    value={taxData.totalGST}
                    subtitle={`CGST: ${formatCurrency(taxData.totalCGST)} | SGST: ${formatCurrency(taxData.totalSGST)}`}
                    icon={IndianRupee}
                    color="bg-accent-blue/10 text-accent-blue"
                />
                <TaxCard
                    label="TDS Deducted"
                    value={taxData.totalTDS}
                    subtitle={`Across ${lines.filter(l => (l.tds_rate || 0) > 0).length} line items`}
                    icon={ArrowDownRight}
                    color="bg-accent-pink/10 text-accent-pink"
                />
                <TaxCard
                    label="ITC Eligible"
                    value={taxData.itcEligible}
                    subtitle="Est. 85% of GST paid on business inputs"
                    icon={ArrowUpRight}
                    color="bg-accent-green/10 text-accent-green"
                />
                <div className={cn(
                    "intelly-card p-6 flex flex-col justify-between relative overflow-hidden",
                    taxData.netTaxLiability > 0 ? "accent-card-yellow" : "accent-card-green"
                )}>
                    <div className="flex items-center gap-2 mb-2">
                        <Receipt className="h-4 w-4 opacity-60" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Net Tax Liability</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter italic">{formatCurrency(taxData.netTaxLiability)}</h2>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-1">
                        GST Output − ITC
                    </span>
                </div>
            </div>

            {/* GST Slab Breakdown */}
            <div className="intelly-card p-8">
                <h3 className="text-lg font-black tracking-tighter uppercase italic mb-6">GST Slab Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/10">
                                {['GST Rate', 'Items', 'Taxable Base', 'CGST', 'SGST', 'Total GST', 'TDS Deducted'].map(h => (
                                    <th key={h} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-6 py-4 text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {taxData.slabs.map(slab => (
                                <tr key={slab.rate} className="border-b border-border/5 hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-xs font-black px-3 py-1 rounded-lg",
                                            slab.rate === 0 ? "bg-muted text-muted-foreground" :
                                                slab.rate <= 5 ? "bg-accent-green/10 text-accent-green" :
                                                    slab.rate <= 12 ? "bg-accent-blue/10 text-accent-blue" :
                                                        slab.rate <= 18 ? "bg-accent-yellow/10 text-accent-yellow" :
                                                            "bg-accent-pink/10 text-accent-pink"
                                        )}>
                                            {slab.rate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold">{slab.count}</td>
                                    <td className="px-6 py-4 text-xs font-bold">{formatCurrency(slab.base)}</td>
                                    <td className="px-6 py-4 text-xs font-bold">{formatCurrency(slab.gst / 2)}</td>
                                    <td className="px-6 py-4 text-xs font-bold">{formatCurrency(slab.gst / 2)}</td>
                                    <td className="px-6 py-4 text-xs font-black text-primary">{formatCurrency(slab.gst)}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-accent-pink">{formatCurrency(slab.tds)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-border/20 bg-muted/20">
                                <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest" colSpan={2}>Totals</td>
                                <td className="px-6 py-4 text-xs font-black">{formatCurrency(taxData.totalBase)}</td>
                                <td className="px-6 py-4 text-xs font-black">{formatCurrency(taxData.totalCGST)}</td>
                                <td className="px-6 py-4 text-xs font-black">{formatCurrency(taxData.totalSGST)}</td>
                                <td className="px-6 py-4 text-xs font-black text-primary">{formatCurrency(taxData.totalGST)}</td>
                                <td className="px-6 py-4 text-xs font-black text-accent-pink">{formatCurrency(taxData.totalTDS)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* ITC Report */}
            <div className="intelly-card p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 bg-accent-green/10 rounded-2xl flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-accent-green" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tighter uppercase italic">Input Tax Credit Summary</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Estimated ITC recovery on eligible business expenses</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-muted/30 rounded-2xl p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">GST Paid (Input)</p>
                        <p className="text-xl font-black tracking-tighter">{formatCurrency(taxData.totalGST)}</p>
                    </div>
                    <div className="bg-accent-green/5 border border-accent-green/10 rounded-2xl p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">ITC Claimable</p>
                        <p className="text-xl font-black tracking-tighter text-accent-green">{formatCurrency(taxData.itcEligible)}</p>
                        <p className="text-[9px] font-bold opacity-40 mt-1">85% of GST on eligible inputs</p>
                    </div>
                    <div className="bg-accent-yellow/5 border border-accent-yellow/10 rounded-2xl p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Net Cash Outflow</p>
                        <p className="text-xl font-black tracking-tighter">{formatCurrency(taxData.totalBase + taxData.totalGST - taxData.totalTDS - taxData.itcEligible)}</p>
                        <p className="text-[9px] font-bold opacity-40 mt-1">Base + GST − TDS − ITC</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TaxCard = ({ label, value, subtitle, icon: Icon, color }: {
    label: string; value: number; subtitle: string; icon: any; color: string;
}) => (
    <div className="intelly-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
            <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", color)}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
        </div>
        <h2 className="text-2xl font-black tracking-tighter italic mb-1">{formatCurrency(value)}</h2>
        <p className="text-[9px] font-bold opacity-40">{subtitle}</p>
    </div>
);
