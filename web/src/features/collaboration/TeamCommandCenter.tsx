import React from 'react';
import {
    MessageSquare, SquareCheck,
    Plus, Star
} from 'lucide-react';
import { TaskBoard } from './TaskBoard';
import { DispatchFeed } from './DispatchFeed';
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

export type UserRole = 'director' | 'coordinator' | 'vendor' | 'client';

export const TeamCommandCenter = () => {
    const [activeRole, setActiveRole] = React.useState<UserRole>('director');

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

                    {/* Role Selector for Demo */}
                    <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/5 ml-4">
                        {(['director', 'coordinator', 'vendor', 'client'] as UserRole[]).map(role => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                    activeRole === role ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {(activeRole === 'director' || activeRole === 'coordinator' || activeRole === 'client') && (
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
                )}
                {(activeRole === 'director' || activeRole === 'client') && (
                    <CommandCard accent="blue" className="flex flex-col justify-between h-[200px]">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Venue Load</p>
                        <h2 className="text-4xl font-black tracking-tighter italic">Optimum</h2>
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-white text-white rotate-12" />
                            <span className="text-[10px] font-black">Sensor Level 4</span>
                        </div>
                    </CommandCard>
                )}
                {(activeRole === 'director' || activeRole === 'coordinator') && (
                    <div className={cn("grid gap-8", activeRole === 'director' ? "lg:col-span-2 grid-cols-2" : "lg:col-span-1 grid-cols-1")}>
                        <CommandCard accent="yellow" className="flex flex-col items-center justify-center text-center">
                            <MessageSquare className="h-8 w-8 mb-4 rotate-6" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Live Comms</p>
                            <h3 className="text-2xl font-black tracking-tighter">148 msg</h3>
                        </CommandCard>
                        {activeRole === 'director' && (
                            <CommandCard accent="green" className="flex flex-col items-center justify-center text-center">
                                <SquareCheck className="h-8 w-8 mb-4 -rotate-12" />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Check-ins</p>
                                <h3 className="text-2xl font-black tracking-tighter">4.2k</h3>
                            </CommandCard>
                        )}
                    </div>
                )}
                {activeRole === 'vendor' && (
                    <div className="lg:col-span-4 bg-accent-blue/5 border border-accent-blue/10 rounded-[2.5rem] p-8 flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase italic">Vendor Portal</h3>
                            <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Showing tasks assigned to your organization</p>
                        </div>
                        <div className="h-14 w-14 bg-accent-blue rounded-2xl shadow-lg flex items-center justify-center text-white">
                            <SquareCheck className="h-6 w-6" />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Task Board Simulation */}
                <div className="xl:col-span-8 space-y-8">
                    <TaskBoard role={activeRole} />
                </div>

                {/* Live Activity / Dispatch */}
                <div className="xl:col-span-4 space-y-8">
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">Live Dispatch</h3>
                    <div className="h-[600px]">
                        <DispatchFeed role={activeRole} />
                    </div>
                </div>
            </div>
        </div>
    );
};
