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
            "w-full flex items-center mb-2 group relative transition-all duration-300",
            minimized ? "justify-center h-14" : "justify-start gap-4 px-6 py-3 rounded-full",
            active && !minimized ? "bg-white text-[#1a1a1a] shadow-xl" : "",
            !active && !minimized ? "text-white/40 hover:text-white" : "",
            !active && minimized ? "text-white/40 hover:text-white" : ""
        )}
    >
        {active && minimized && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-[34px] bg-white rounded-full shadow-md z-0" />
        )}
        <Icon
            className={cn(
                "h-[22px] w-[22px] shrink-0 z-10 relative",
                active ? "text-[#8FB755]" : "transition-colors"
            )}
            strokeWidth={1.75}
        />
        {!minimized && <span className="truncate font-bold tracking-wide z-10 relative">{label}</span>}
        {minimized && (
            <div className="absolute left-16 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-2xl border border-white/5">
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
        <div className="h-[100dvh] w-full bg-[#F4F1ED] flex overflow-hidden font-sans">
            {/* Sidebar (Fixed & Sleek Island) */}
            <aside className={cn(
                "bg-[#0a0a0a] flex-shrink-0 flex flex-col py-8 px-5 z-50 transition-all duration-500 ease-in-out relative m-4 rounded-[3rem] shadow-2xl h-[calc(100vh-2rem)]",
                isMinimized ? "w-[90px] px-2 items-center" : "w-[280px]"
            )}>
                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="absolute -right-3 top-28 h-7 w-7 bg-[#8FB755] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#8FB755]/30 hover:scale-110 active:scale-95 transition-all z-[60] border-4 border-[#F4F1ED]"
                >
                    {isMinimized ? <ChevronRight className="h-3 w-3" strokeWidth={3} /> : <ChevronLeft className="h-3 w-3" strokeWidth={3} />}
                </button>

                <div className={cn("flex items-center gap-4 mb-16", isMinimized ? "justify-center mt-2" : "pl-3 mt-2")}>
                    <div className="h-[42px] w-[42px] bg-[#8FB755] rounded-full flex-shrink-0 flex items-center justify-center relative shadow-[0_0_20px_rgba(143,183,85,0.4)]">
                        <div className="h-3 w-3 bg-white rounded-full absolute" />
                    </div>
                    {!isMinimized && <span className="text-xl font-black tracking-widest text-white uppercase italic">Orqestra</span>}
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto hide-scrollbar -mx-2 px-2 w-full">
                    {!isMinimized && <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 pl-4">General</p>}
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

                    <div className="pt-8 pb-6 w-full">
                        {!isMinimized && <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 pl-4">Tools</p>}
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

                <div className="mt-auto pt-6 border-t border-white/5 w-full">
                    <button
                        onClick={onSignOut}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 text-white/40 hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px] w-full rounded-2xl hover:bg-white/5",
                            isMinimized ? "px-0 justify-center" : ""
                        )}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!isMinimized && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Wrapper (Header + Content split) */}
            <div className="flex-1 flex flex-col h-screen min-w-0">
                {/* Fixed Static Header (Stretches across both columns) */}
                <header className="flex-shrink-0 h-[104px] flex items-center justify-between px-8 z-40 bg-transparent">
                    <div className="flex items-center gap-4 bg-white rounded-full px-6 h-12 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] w-full max-w-2xl border border-black/5">
                        <Search className="h-4 w-4 text-[#8FB755]" strokeWidth={2.5} />
                        <input
                            placeholder="Search everything..."
                            className="bg-transparent border-none outline-none text-sm font-bold w-full placeholder:text-black/30 text-black h-full px-2"
                        />
                        <div className="flex items-center gap-1 opacity-50 ml-auto">
                            <span className="text-[10px] font-black bg-[#F4F1ED] px-2 py-1 rounded-lg">CMD</span>
                            <span className="text-[10px] font-black bg-[#F4F1ED] px-2 py-1 rounded-lg">K</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-black/40 hover:text-black transition-colors relative shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-black/5">
                                <Bell className="h-[22px] w-[22px]" strokeWidth={1.5} />
                                <div className="absolute top-3.5 right-3.5 h-[6px] w-[6px] bg-[#8FB755] rounded-full" />
                            </button>
                            <button className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-black/40 hover:text-black transition-colors shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-black/5">
                                <Settings className="h-[22px] w-[22px]" strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 bg-white px-2 py-1.5 pr-6 rounded-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-md transition-all border border-black/5">
                            <div className="h-9 w-9 bg-[#8FB755] text-white flex items-center justify-center rounded-full font-black text-sm">
                                AM
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-[13px] font-black tracking-tighter uppercase leading-none mb-0.5 text-[#111]">Ali M.</p>
                                <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest whitespace-nowrap">Event Director</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area flex container (Main View + Right Sidebar) */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Independent Scrollable Main View Area */}
                    <main className="flex-1 overflow-y-auto hide-scrollbar px-8 pb-8">
                        {children}
                    </main>

                    {/* Right Panel (Independent Scrolling Calendar/Timeline) */}
                    <aside className="w-[380px] hidden xl:flex flex-col gap-6 px-6 pb-6 overflow-y-auto hide-scrollbar border-l border-black/[0.03] flex-shrink-0">
                        {/* Calendar */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-black/5">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[13px] font-black uppercase tracking-widest text-[#111]">May 2024</h4>
                                <div className="flex gap-2 text-black/40">
                                    <button className="hover:text-black transition-colors"><ChevronLeft className="h-4 w-4" strokeWidth={2.5} /></button>
                                    <button className="hover:text-black transition-colors"><ChevronRight className="h-4 w-4" strokeWidth={2.5} /></button>
                                </div>
                            </div>
                            {/* Simplified Calendar Grid */}
                            <div className="grid grid-cols-7 gap-y-6 text-center">
                                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                                    <span key={d} className="text-[10px] font-black text-black/30 uppercase">{d}</span>
                                ))}
                                {Array.from({ length: 31 }).map((_, i) => (
                                    <div key={i} className={cn(
                                        "h-9 w-9 flex items-center justify-center text-sm font-black mx-auto rounded-xl",
                                        i + 1 === 15 ? "bg-[#8FB755] text-white shadow-lg shadow-[#8FB755]/30" : "hover:bg-black/5 cursor-pointer text-black/80"
                                    )}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-10 bg-[#121212] flex items-center justify-center gap-2 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-transform">
                                Add Event
                            </button>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-black/5 flex-1 min-h-[400px]">
                            <div className="mb-10">
                                <h3 className="text-2xl font-black tracking-tighter text-[#111]">May 15</h3>
                                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">Today's Timeline</p>
                            </div>

                            <div className="space-y-8 relative before:absolute before:left-[45px] before:top-2 before:bottom-0 before:w-[2px] before:bg-black/5">
                                <div className="flex gap-6 group relative">
                                    <span className="text-[10px] font-black text-black/30 mt-1 uppercase w-10 text-right shrink-0 tracking-wider">09:00</span>
                                    <div className="absolute left-[41.5px] top-1.5 h-2 w-2 rounded-full bg-[#111] group-hover:scale-125 transition-transform" />
                                    <div className="flex-1 mt-0.5">
                                        <p className="text-xs font-black uppercase tracking-tight text-[#111]">Team Briefing</p>
                                        <p className="text-[10px] font-bold text-black/50 mt-1">Venue Hall A</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group relative">
                                    <span className="text-[10px] font-black text-black/30 mt-1 uppercase w-10 text-right shrink-0 tracking-wider">10:30</span>
                                    <div className="absolute left-[41.5px] top-1.5 h-2 w-2 rounded-full bg-[#111] group-hover:scale-125 transition-transform" />
                                    <div className="flex-1 mt-0.5">
                                        <p className="text-xs font-black uppercase tracking-tight text-[#111]">Keynote Setup</p>
                                        <p className="text-[10px] font-bold text-black/50 mt-1">Main Stage</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group relative opacity-40">
                                    <span className="text-[10px] font-black text-black/30 mt-1 uppercase w-10 text-right shrink-0 tracking-wider">12:00</span>
                                    <div className="absolute left-[41.5px] top-1.5 h-2 w-2 rounded-full bg-black/40 group-hover:bg-[#111] transition-colors" />
                                    <div className="flex-1 mt-0.5">
                                        <p className="text-xs font-black uppercase tracking-tight text-[#111]">Networking Lunch</p>
                                        <p className="text-[10px] font-bold text-black/50 mt-1">Outdoor Plaza</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-12 py-4 rounded-2xl border-2 border-dashed border-black/10 flex items-center justify-center gap-2 text-black/40 hover:text-black/80 hover:border-black/20 transition-all font-bold text-xs uppercase tracking-widest">
                                <Plus className="h-4 w-4" />
                                Quick Entry
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
