import React from 'react';
import {
    MessageSquare, SquareCheck,
    Play, Plus, Clock,
    Star
} from 'lucide-react';
import { cn } from '../../utils/cn';

const CommandCard = ({ children, className, accent }: { children: React.ReactNode, className?: string, accent?: string }) => (
    <div className={cn(
        "intelly-card relative overflow-hidden group p-8",
        accent === 'yellow' && "accent-card-yellow",
        accent === 'pink' && "accent-card-pink",
        accent === 'green' && "accent-card-green",
        accent === 'blue' && "accent-card-blue",
        accent === 'purple' && "accent-card-purple",
        className
    )}>
        {/* Abstract Shape */}
        <div className="absolute -bottom-10 -left-10 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
            </svg>
        </div>
        {children}
    </div>
);

export const TeamCommandCenter = () => {
    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black tracking-tight leading-none italic uppercase">Command Center</h1>
                    <p className="text-sm font-bold text-muted-foreground opacity-60 uppercase tracking-widest mt-2 pl-1">
                        High-frequency collaboration for <span className="text-primary italic">Electronic Sky</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center -space-x-3 pr-4 border-r border-border/20">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-10 w-10 rounded-xl bg-muted border-2 border-[#fbf6ee] shadow-sm transform hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="Team" />
                            </div>
                        ))}
                    </div>
                    <button className="h-14 px-8 bg-[#1a1a1a] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 hover:-translate-y-1 active:translate-y-0 transition-transform">
                        <Plus className="h-4 w-4" />
                        Invite Active
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <CommandCard accent="pink" className="flex flex-col justify-between h-[200px]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Critical Path</p>
                    <h2 className="text-4xl font-black tracking-tighter italic">82%</h2>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full w-[82%]" />
                        </div>
                        <span className="text-[10px] font-black">12 left</span>
                    </div>
                </CommandCard>
                <CommandCard accent="blue" className="flex flex-col justify-between h-[200px]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Venue Load</p>
                    <h2 className="text-4xl font-black tracking-tighter italic">Optimum</h2>
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-white text-white rotate-12" />
                        <span className="text-[10px] font-black">Sensor Level 4</span>
                    </div>
                </CommandCard>
                <div className="lg:col-span-2 grid grid-cols-2 gap-8">
                    <CommandCard accent="yellow" className="flex flex-col items-center justify-center text-center">
                        <MessageSquare className="h-8 w-8 mb-4 rotate-6" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Live Comms</p>
                        <h3 className="text-2xl font-black tracking-tighter">148 msg</h3>
                    </CommandCard>
                    <CommandCard accent="green" className="flex flex-col items-center justify-center text-center">
                        <SquareCheck className="h-8 w-8 mb-4 -rotate-12" />
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Check-ins</p>
                        <h3 className="text-2xl font-black tracking-tighter">4.2k</h3>
                    </CommandCard>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Task Board Simulation */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic">Run Sheet Pipeline</h3>
                        <div className="flex gap-4">
                            <button className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary">Timeline</button>
                            <button className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest border-b-4 border-primary">Kanban</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['Planning', 'Executing', 'Review'].map((col, i) => (
                            <div key={i} className="flex flex-col gap-6">
                                <div className="flex items-center justify-between px-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{col}</h4>
                                    <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded-md">3</span>
                                </div>
                                <div className="space-y-6">
                                    {Array.from({ length: 2 }).map((_, j) => (
                                        <div key={j} className="bg-white rounded-[2rem] p-6 shadow-sm border border-border/5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className={cn("h-2 w-2 rounded-full", i === 0 ? "bg-accent-blue" : i === 1 ? "bg-accent-pink" : "bg-accent-green")} />
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Priority High</span>
                                            </div>
                                            <p className="text-sm font-black tracking-tight leading-snug mb-6 group-hover:text-primary transition-colors">
                                                {i === 0 ? "Finalize Main Stage lighting rig" : "Catering vendor final contract"}
                                            </p>
                                            <div className="flex items-center justify-between border-t border-border/10 pt-4 mt-2">
                                                <div className="h-8 w-8 rounded-lg bg-muted overflow-hidden">
                                                    <img src={`https://ui-avatars.com/api/?name=U&background=random`} alt="Assigned" />
                                                </div>
                                                <div className="flex items-center gap-1 opacity-40">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase">2d left</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full h-14 border-2 border-dashed border-border/20 rounded-[2rem] flex items-center justify-center text-muted-foreground/30 hover:border-primary/20 hover:text-primary transition-all">
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Activity / Dispatch */}
                <div className="xl:col-span-4 space-y-8">
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">Live Dispatch</h3>

                    <div className="bg-[#1a1a1a] text-white rounded-[2.5rem] p-10 min-h-[500px] flex flex-col shadow-2xl relative overflow-hidden">
                        {/* Decorative Radar effect */}
                        <div className="absolute -top-20 -right-20 h-64 w-64 border border-white/5 rounded-full animate-ping opacity-20" />
                        <div className="absolute -top-10 -right-10 h-44 w-44 border border-white/10 rounded-full" />

                        <div className="flex-1 space-y-10 relative z-10">
                            {[
                                { user: "Sarah", msg: "VIP Lobby: Floor cleaning in progress.", time: "2m ago", color: "text-blue-400" },
                                { user: "Mark", msg: "Main Stage: Sound check complete.", time: "5m ago", color: "text-green-400" },
                                { user: "AI Assistant", msg: "Prediction: Attendee flow increasing at North Gate.", time: "12m ago", color: "text-pink-400 italic" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="h-10 w-10 flex-shrink-0 bg-white/10 rounded-xl flex items-center justify-center font-black">
                                        {item.user[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.user}</span>
                                            <span className="text-[9px] font-medium opacity-40 uppercase tracking-widest">{item.time}</span>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{item.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 bg-white/5 rounded-3xl p-2 flex gap-2 border border-white/10">
                            <input
                                placeholder="Enter dispatch message..."
                                className="bg-transparent border-none outline-none text-xs font-bold px-4 py-3 flex-1 placeholder:text-white/20"
                            />
                            <button className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform">
                                <Play className="h-4 w-4 fill-white text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
