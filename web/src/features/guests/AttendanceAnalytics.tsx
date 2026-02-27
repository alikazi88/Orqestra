import {
    Users, TrendingUp, Calendar,
    BarChart3, ArrowUp, ArrowDown,
    Award
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface EventAttendance {
    eventName: string;
    date: string;
    invited: number;
    attended: number;
    returnRate: number;
    newGuests: number;
}

const ATTENDANCE_DATA: EventAttendance[] = [
    { eventName: 'Annual Gala 2025', date: '2025-11-15', invited: 520, attended: 487, returnRate: 72, newGuests: 136 },
    { eventName: 'Product Launch Q4', date: '2025-10-02', invited: 300, attended: 280, returnRate: 45, newGuests: 154 },
    { eventName: 'Team Offsite Goa', date: '2025-08-20', invited: 130, attended: 120, returnRate: 88, newGuests: 14 },
    { eventName: 'Client Summit', date: '2025-06-10', invited: 400, attended: 350, returnRate: 55, newGuests: 157 },
    { eventName: 'Founder\'s Day', date: '2025-03-15', invited: 650, attended: 600, returnRate: 68, newGuests: 192 },
    { eventName: 'Winter Networking', date: '2024-12-08', invited: 200, attended: 175, returnRate: 40, newGuests: 105 },
];

export const AttendanceAnalytics = () => {
    const totalAttended = ATTENDANCE_DATA.reduce((s, e) => s + e.attended, 0);
    const avgAttendanceRate = Math.round(
        (ATTENDANCE_DATA.reduce((s, e) => s + (e.attended / e.invited), 0) / ATTENDANCE_DATA.length) * 100
    );
    const avgReturnRate = Math.round(
        ATTENDANCE_DATA.reduce((s, e) => s + e.returnRate, 0) / ATTENDANCE_DATA.length
    );
    const totalNewGuests = ATTENDANCE_DATA.reduce((s, e) => s + e.newGuests, 0);

    // Identify loyalists (attended 3+ events)
    const loyalistCount = Math.round(totalAttended * (avgReturnRate / 100) * 0.4);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-accent-blue to-primary rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                    <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Attendance Analytics</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Longitudinal trends across recurring events</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Attended</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">{totalAttended.toLocaleString()}</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Avg Attendance</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">{avgAttendanceRate}%</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Return Rate</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic text-accent-green">{avgReturnRate}%</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Award className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Loyalists</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic text-primary">{loyalistCount}</span>
                </div>
                <div className="intelly-card p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="h-3.5 w-3.5 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">New Guests</span>
                    </div>
                    <span className="text-3xl font-black tracking-tighter italic">{totalNewGuests}</span>
                </div>
            </div>

            {/* Attendance Over Time */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> Attendance Breakdown
                </h3>
                <div className="space-y-4">
                    {ATTENDANCE_DATA.map((event, i) => {
                        const rate = Math.round((event.attended / event.invited) * 100);
                        const prevRate = i < ATTENDANCE_DATA.length - 1
                            ? Math.round((ATTENDANCE_DATA[i + 1].attended / ATTENDANCE_DATA[i + 1].invited) * 100) : rate;
                        const improving = rate >= prevRate;

                        return (
                            <div key={event.eventName} className="flex items-center gap-4">
                                <span className="text-xs font-bold w-40 truncate">{event.eventName}</span>
                                <span className="text-[9px] font-bold text-muted-foreground w-16">
                                    {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                                </span>
                                <div className="flex-1 h-5 bg-muted/20 rounded-full overflow-hidden relative">
                                    <div className="h-full bg-primary/20 rounded-full" style={{ width: `${100}%` }} />
                                    <div
                                        className="h-full bg-primary rounded-full absolute top-0 left-0 transition-all"
                                        style={{ width: `${rate}%` }}
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white mix-blend-difference">
                                        {event.attended}/{event.invited}
                                    </span>
                                </div>
                                <span className="text-xs font-black w-10 text-right">{rate}%</span>
                                <span className={cn("w-6 flex justify-center", improving ? "text-accent-green" : "text-accent-pink")}>
                                    {improving ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Return Rate Insights */}
            <div className="intelly-card p-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Guest Retention Insights</h3>
                <div className="space-y-3">
                    {ATTENDANCE_DATA.sort((a, b) => b.returnRate - a.returnRate).slice(0, 4).map(e => (
                        <div key={e.eventName} className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-lg bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-[9px] font-black text-accent-green">{e.returnRate}%</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-xs font-bold">{e.eventName}</span>
                                <p className="text-[9px] font-medium text-muted-foreground">{e.newGuests} new guests, {e.attended - e.newGuests} returning</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
