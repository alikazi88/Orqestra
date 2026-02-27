import {
    IndianRupee, Ticket, Briefcase, ArrowRight,
    TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { PLATFORM_FEES, calculatePlatformFee } from '../../config/platformConfig';

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

interface FeeBreakdown {
    ticketRevenue: number;
    vendorBookings: number;
}

export const PlatformFeeCalculator = ({ data }: { data: FeeBreakdown }) => {
    const ticketFee = calculatePlatformFee(data.ticketRevenue, 'ticket');
    const vendorFee = calculatePlatformFee(data.vendorBookings, 'vendor_booking');
    const totalFees = ticketFee + vendorFee;
    const totalGross = data.ticketRevenue + data.vendorBookings;
    const netRevenue = totalGross - totalFees;

    return (
        <div className="space-y-6">
            {/* Fee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeeCard
                    label="Ticket Sales Fee"
                    rate={PLATFORM_FEES.ticketFeePercent}
                    base={data.ticketRevenue}
                    fee={ticketFee}
                    icon={Ticket}
                    color="bg-accent-blue/10 text-accent-blue"
                />
                <FeeCard
                    label="Vendor Booking Fee"
                    rate={PLATFORM_FEES.vendorBookingFeePercent}
                    base={data.vendorBookings}
                    fee={vendorFee}
                    icon={Briefcase}
                    color="bg-accent-pink/10 text-accent-pink"
                />
                <div className="intelly-card p-6 flex flex-col justify-between accent-card-green">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-white/10">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Net Revenue</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter italic">{formatCurrency(netRevenue)}</h2>
                    <p className="text-[9px] font-bold opacity-40 mt-1">After {formatCurrency(totalFees)} in platform fees</p>
                </div>
            </div>

            {/* Fee Breakdown Table */}
            <div className="intelly-card p-6">
                <h4 className="text-sm font-black uppercase tracking-widest opacity-50 mb-4">Fee Breakdown</h4>
                <div className="space-y-3">
                    <FeeRow label="Gross Ticket Revenue" amount={data.ticketRevenue} />
                    <FeeRow label={`Platform Fee (${PLATFORM_FEES.ticketFeePercent}%)`} amount={-ticketFee} isDeduction />
                    <div className="border-t border-border/10 pt-3">
                        <FeeRow label="Gross Vendor Bookings" amount={data.vendorBookings} />
                    </div>
                    <FeeRow label={`Platform Fee (${PLATFORM_FEES.vendorBookingFeePercent}%)`} amount={-vendorFee} isDeduction />
                    <div className="border-t-2 border-border/20 pt-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <IndianRupee className="h-4 w-4 text-primary" />
                                <span className="text-sm font-black uppercase tracking-tight">Net Payout</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground line-through">{formatCurrency(totalGross)}</span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span className="text-lg font-black tracking-tighter text-primary">{formatCurrency(netRevenue)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeeCard = ({ label, rate, base, fee, icon: Icon, color }: {
    label: string; rate: number; base: number; fee: number; icon: any; color: string;
}) => (
    <div className="intelly-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
            <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", color)}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
        </div>
        <div>
            <h2 className="text-2xl font-black tracking-tighter italic">{formatCurrency(fee)}</h2>
            <p className="text-[9px] font-bold opacity-40 mt-1">{rate}% of {formatCurrency(base)}</p>
        </div>
    </div>
);

const FeeRow = ({ label, amount, isDeduction }: { label: string; amount: number; isDeduction?: boolean }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs font-bold opacity-60">{label}</span>
        <span className={cn("text-xs font-black", isDeduction ? "text-accent-pink" : "")}>
            {isDeduction ? '−' : ''}{formatCurrency(Math.abs(amount))}
        </span>
    </div>
);
