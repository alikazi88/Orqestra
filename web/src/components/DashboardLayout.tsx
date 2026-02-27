import React from 'react';
import {
    Search, Settings, LayoutDashboard, Calendar, Ticket,
    BarChart3, MapPin, Users, Bell, LogOut,
    Plus, ChevronRight, MessageSquare, Briefcase,
    ChevronLeft, SquareCheck
} from 'lucide-react';
import { cn } from '../utils/cn';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick, minimized }: NavItemProps & { minimized?: boolean }) => (
    <button
        onClick={onClick}
        className={cn(
            "pill-nav w-full justify-start gap-4 mb-2 group relative transition-all duration-300",
            active
                ? "bg-white text-[#1a1a1a] shadow-xl shadow-white/10"
                : "text-white/40 hover:text-white hover:bg-white/5",
            minimized ? "px-0 justify-center h-12" : ""
        )}
    >
        <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "transition-colors")} />
        {!minimized && <span className="truncate font-bold tracking-tight">{label}</span>}
        {active && !minimized && (
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-primary rounded-r-full animate-in slide-in-from-left duration-300" />
        )}
        {active && minimized && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />
        )}
        {minimized && (
            <div className="absolute left-14 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-2xl border border-white/5">
                {label}
            </div>
        )}
    </button>
);

interface DashboardLayoutProps {
    children: React.ReactNode;
    onSignOut?: () => void;
    currentView?: string;
    onViewChange?: (view: any) => void;
}

export const DashboardLayout = ({ children, onSignOut, currentView, onViewChange }: DashboardLayoutProps) => {
    const [isMinimized, setIsMinimized] = React.useState(false);

    return (
        <div className="min-h-screen bg-[#fbf6ee] flex overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "intelly-sidebar flex-shrink-0 flex flex-col p-8 z-50 transition-all duration-500 ease-in-out relative",
                isMinimized ? "w-24 px-4" : "w-80"
            )}>
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="absolute -right-3 top-32 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all z-[60]"
                >
                    {isMinimized ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </button>

                <div className={cn("flex items-center gap-4 mb-14 pl-2", isMinimized ? "justify-center pl-0" : "")}>
                    <div className="h-10 w-10 bg-primary rounded-2xl flex-shrink-0 flex items-center justify-center rotate-3 shadow-lg shadow-primary/20">
                        <div className="h-4 w-4 bg-white rounded-full" />
                    </div>
                    {!isMinimized && <span className="text-2xl font-black tracking-tighter uppercase italic">Orqestra</span>}
                </div>

                <div className="flex-1 space-y-1">
                    {!isMinimized && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 pl-6">General</p>}
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={currentView === 'dashboard'}
                        onClick={() => onViewChange?.('dashboard')}
                        minimized={isMinimized}
                    />
                    <NavItem
                        icon={Calendar}
                        label="Events"
                        active={currentView === 'events'}
                        onClick={() => onViewChange?.('events')}
                        minimized={isMinimized}
                    />
                    <NavItem
                        icon={MapPin}
                        label="Venues"
                        active={currentView === 'venues'}
                        onClick={() => onViewChange?.('venues')}
                        minimized={isMinimized}
                    />
                    <NavItem
                        icon={Users}
                        label="Vendors"
                        active={currentView === 'vendors'}
                        onClick={() => onViewChange?.('vendors')}
                        minimized={isMinimized}
                    />

                    <div className="pt-8 pb-6">
                        {!isMinimized && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6 pl-6">Tools</p>}
                        <NavItem icon={MessageSquare} label="Chats" minimized={isMinimized} />
                        <NavItem icon={Briefcase} label="Projects" minimized={isMinimized} />
                        <NavItem icon={BarChart3} label="Analytics" minimized={isMinimized} />
                        <NavItem icon={Ticket} label="Ticketing" minimized={isMinimized} />
                        <NavItem
                            icon={SquareCheck}
                            label="Command Center"
                            active={currentView === 'command-center'}
                            onClick={() => onViewChange?.('command-center')}
                            minimized={isMinimized}
                        />
                        <NavItem icon={Settings} label="Settings" minimized={isMinimized} />
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                    <button
                        onClick={onSignOut}
                        className={cn(
                            "flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]",
                            isMinimized ? "px-0 justify-center" : ""
                        )}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!isMinimized && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden overflow-y-auto pt-6 px-6 pb-6">
                {/* Top Header */}
                <header className="flex items-center justify-between mb-10 px-4">
                    <div className="flex items-center gap-4 bg-white rounded-full px-8 py-3 shadow-sm border border-border/10 flex-1 max-w-xl">
                        <Search className="h-4 w-4 text-primary" />
                        <input
                            placeholder="Search everything..."
                            className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-muted-foreground/40"
                        />
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-black text-muted-foreground/30 bg-muted px-2 py-0.5 rounded-md">CMD</span>
                            <span className="text-[10px] font-black text-muted-foreground/30 bg-muted px-2 py-0.5 rounded-md">K</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="h-12 w-12 rounded-2xl bg-white border border-border/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors relative shadow-sm">
                                <Bell className="h-5 w-5" />
                                <div className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full border-2 border-white" />
                            </button>
                            <button className="h-12 w-12 rounded-2xl bg-white border border-border/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm">
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="h-8 w-px bg-border/40 mx-2" />

                        <div className="flex items-center gap-3 bg-white p-1.5 pr-6 rounded-2xl border border-border/10 shadow-sm cursor-pointer hover:border-primary/20 transition-all">
                            <div className="h-10 w-10 rounded-xl bg-[#8FB755] overflow-hidden border border-white shadow-inner">
                                <img src="https://ui-avatars.com/api/?name=Ali+M&background=8FB755&color=fff" alt="Profile" />
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-xs font-black truncate uppercase tracking-tighter leading-none mb-1">Ali M.</p>
                                <p className="text-[9px] font-black text-muted-foreground uppercase opacity-50 tracking-widest whitespace-nowrap">Event Director</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main View Area */}
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>

            {/* Right Panel Simulation (Optional - can be integrated into main content or stay fixed) */}
            <aside className="w-[380px] hidden 2xl:flex flex-col gap-6 p-6 overflow-y-auto border-l border-border/10">
                {/* Calendar Placeholder */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/5">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-sm font-black uppercase tracking-widest">May 2024</h4>
                        <div className="flex gap-2">
                            <button className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"><ChevronRight className="h-4 w-4 rotate-180" /></button>
                            <button className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
                        </div>
                    </div>
                    {/* Simplified Calendar Grid */}
                    <div className="grid grid-cols-7 gap-y-4 text-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                            <span key={d} className="text-[10px] font-black text-muted-foreground opacity-40">{d}</span>
                        ))}
                        {Array.from({ length: 31 }).map((_, i) => (
                            <div key={i} className={cn(
                                "h-9 w-9 flex items-center justify-center text-sm font-bold rounded-xl",
                                i + 1 === 15 ? "bg-primary text-white shadow-lg shadow-primary/30 rotate-3" : "hover:bg-muted cursor-pointer"
                            )}>
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 bg-[#1a1a1a] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-transform hover:-translate-y-1 active:translate-y-0">
                        Add Event
                    </button>
                </div>

                {/* Timeline Placeholder */}
                <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/5">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black tracking-tighter">May 15</h3>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Today's Timeline</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4 group">
                            <span className="text-[10px] font-black text-muted-foreground/30 mt-1 uppercase">09:00</span>
                            <div className="flex-1 p-4 bg-accent-pink rounded-2xl group-hover:scale-[1.02] transition-transform">
                                <p className="text-xs font-black uppercase tracking-tight">Team Briefing</p>
                                <p className="text-[10px] font-bold opacity-60">Venue Hall A</p>
                            </div>
                        </div>
                        <div className="flex gap-4 group">
                            <span className="text-[10px] font-black text-muted-foreground/30 mt-1 uppercase">10:30</span>
                            <div className="flex-1 p-4 bg-accent-blue rounded-2xl group-hover:scale-[1.02] transition-transform">
                                <p className="text-xs font-black uppercase tracking-tight">Keynote Setup</p>
                                <p className="text-[10px] font-bold opacity-60">Main Stage</p>
                            </div>
                        </div>
                        <div className="flex gap-4 group opacity-40 grayscale">
                            <span className="text-[10px] font-black text-muted-foreground/30 mt-1 uppercase">12:00</span>
                            <div className="flex-1 p-4 bg-accent-yellow rounded-2xl">
                                <p className="text-xs font-black uppercase tracking-tight">Networking Lunch</p>
                                <p className="text-[10px] font-bold opacity-60">Outdoor Plaza</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-8 py-3 rounded-2xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground/50 hover:text-muted-foreground/80 hover:border-muted-foreground/30 transition-all font-bold text-xs">
                        <Plus className="h-4 w-4" />
                        Quick Entry
                    </button>
                </div>
            </aside>
        </div>
    );
};
