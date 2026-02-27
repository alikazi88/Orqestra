import {
    ChevronRight, Clock,
    Play, Star,
    TrendingUp, Users
} from 'lucide-react';
import { cn } from '../../utils/cn';

const DashboardCard = ({ children, className, accent }: { children: React.ReactNode, className?: string, accent?: string }) => (
    <div className={cn(
        "intelly-card relative overflow-hidden group",
        accent === 'yellow' && "accent-card-yellow",
        accent === 'pink' && "accent-card-pink",
        accent === 'green' && "accent-card-green",
        accent === 'blue' && "accent-card-blue",
        accent === 'purple' && "accent-card-purple",
        className
    )}>
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="90" cy="30" r="60" fill="currentColor" />
                <rect x="10" y="60" width="40" height="40" rx="10" transform="rotate(15 10 60)" fill="currentColor" />
            </svg>
        </div>
        {children}
    </div>
);

export const Dashboard = () => {
    return (
        <div className="flex flex-col gap-10">
            {/* Header / Greeting */}
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-black tracking-tight leading-none">Good morning, Ali</h1>
                <p className="text-sm font-bold text-muted-foreground opacity-60 uppercase tracking-widest pl-1">
                    Ready to orchestrate something amazing today?
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                {/* Large Stat Card - Yellow */}
                <DashboardCard accent="yellow" className="lg:col-span-3 min-h-[280px] flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80">Workspace Activity</p>
                        <h2 className="text-4xl font-black tracking-tighter">14 <span className="text-sm opacity-60 font-medium">events</span></h2>
                        <div className="flex gap-2 mt-4">
                            <span className="px-2 py-0.5 bg-white/40 rounded-md text-[10px] font-black italic">Active Sessions</span>
                            <span className="px-2 py-0.5 bg-white/40 rounded-md text-[10px] font-black italic">48% +</span>
                        </div>
                    </div>
                    {/* Tiny Chart Visualization */}
                    <div className="flex items-end gap-1.5 h-16 mt-8">
                        {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                            <div key={i} className="flex-1 bg-[#1a1a1a]/10 rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </DashboardCard>

                {/* Medium Stat Card - Purple */}
                <DashboardCard accent="purple" className="lg:col-span-4 min-h-[280px] flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80">Visitor Traffic</p>
                        <h2 className="text-4xl font-black tracking-tighter">24.5k <span className="text-sm opacity-60 font-medium">views</span></h2>
                        <div className="flex gap-4 mt-6">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase opacity-40">Direct</p>
                                <p className="text-sm font-black">12k</p>
                            </div>
                            <div className="h-6 w-px bg-white/20 self-center" />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase opacity-40">Social</p>
                                <p className="text-sm font-black">8.2k</p>
                            </div>
                        </div>
                    </div>
                    {/* Line Chart Placeholder */}
                    <div className="relative h-20 w-full mt-4">
                        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <path
                                d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-[#4c1d95]/40"
                            />
                            <circle cx="200" cy="30" r="5" fill="#4c1d95" />
                        </svg>
                    </div>
                </DashboardCard>

                {/* Grid Split Cards */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-8 h-full">
                    <DashboardCard accent="green" className="flex flex-col justify-center gap-4 text-center items-center">
                        <div className="h-16 w-16 bg-white/40 rounded-[1.5rem] flex items-center justify-center rotate-6 scale-90">
                            <Users className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">New Vendors</p>
                            <h2 className="text-3xl font-black tracking-tighter">18</h2>
                        </div>
                    </DashboardCard>
                    <DashboardCard accent="blue" className="flex flex-col justify-center gap-4 text-center items-center">
                        <div className="h-16 w-16 bg-white/40 rounded-[1.5rem] flex items-center justify-center -rotate-12 scale-90">
                            <Star className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Rating Avg</p>
                            <h2 className="text-3xl font-black tracking-tighter">4.9/5</h2>
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* Bottom Section - Lists */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Active Projects / Events */}
                <div className="xl:col-span-7 flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic">Active Orchestrations</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]/40 hover:text-primary transition-colors flex items-center gap-2">
                            View All <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: "Electronic Sky", time: "09:45 AM", type: "Music Festival", color: "bg-pink-100", text: "text-pink-700" },
                            { name: "Global Tech Summit", time: "11:20 AM", type: "Conference", color: "bg-blue-100", text: "text-blue-700" },
                            { name: "Neon Art Gallery", time: "01:00 PM", type: "Exhibition", color: "bg-green-100", text: "text-green-700" },
                            { name: "Midnight Jazz Club", time: "05:15 PM", type: "Live Show", color: "bg-accent-yellow/40", text: "text-yellow-900" }
                        ].map((event, i) => (
                            <div key={i} className="bg-white rounded-3xl p-5 pl-8 pr-8 flex items-center justify-between group hover:shadow-xl hover:shadow-[#1a1a1a]/5 transition-all cursor-pointer border border-transparent hover:border-border/10">
                                <div className="flex items-center gap-6">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center font-black", event.color, event.text)}>
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">{event.name}</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">{event.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-full">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-[10px] font-black">{event.time}</span>
                                        </div>
                                    </div>
                                    <button className="h-10 w-10 bg-[#1a1a1a] text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team / Live Updates */}
                <div className="xl:col-span-5 flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic">Team Vitals</h3>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-accent-pink/20 rounded-full animate-pulse">
                            <div className="h-2 w-2 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase">Live Feed</span>
                        </div>
                    </div>

                    <div className="bg-[#f8c8d3]/40 rounded-[2.5rem] p-10 flex flex-col gap-8 border border-white/20">
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#831843]/60 mb-2">Focused Dispatch</p>
                            <h2 className="text-3xl font-black tracking-tighter text-[#831843]">Sarah <span className="text-lg opacity-40 italic">&</span> James</h2>
                            <p className="text-xs font-semibold text-[#831843]/60 leading-relaxed italic mt-4">
                                "Finalizing the catering logistics for Electronic Sky. Need approval on the VIP lounge layout by EOD."
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#831843]/10 pt-8 mt-4">
                            <div className="flex -space-x-3 overflow-hidden">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="inline-block h-12 w-12 rounded-2xl ring-4 ring-[#fbf6ee] bg-[#1a1a1a]/5 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${i}&background=random`} alt="Team" />
                                    </div>
                                ))}
                                <div className="flex items-center justify-center h-12 w-12 rounded-2xl ring-4 ring-[#fbf6ee] bg-white text-[10px] font-black">
                                    +8
                                </div>
                            </div>

                            <button className="h-14 px-8 bg-[#1a1a1a] text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-3 active:scale-95 transition-transform">
                                <Play className="h-3 w-3 fill-white" />
                                Connect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
