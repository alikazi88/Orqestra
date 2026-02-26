import React from 'react';
import { Bell, Search, User, Settings, LayoutDashboard, Calendar, Ticket, BarChart3, LifeBuoy } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
}

const NavItem = ({ icon: Icon, label, active }: NavItemProps) => (
    <button className={cn(
        "flex items-center gap-2.5 px-6 py-2 rounded-full transition-all duration-200 text-sm font-semibold",
        active ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:bg-muted"
    )}>
        <Icon className="h-4 w-4" />
        {label}
    </button>
);

export const DashboardLayout = ({ children, onSignOut }: { children: React.ReactNode, onSignOut?: () => void }) => {
    return (
        <div className="min-h-screen bg-background soft-gradient-bg">
            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-8">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-foreground rounded-lg flex items-center justify-center">
                        <div className="h-4 w-4 bg-white rounded-sm rotate-45" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Orqestra</span>
                </div>

                <nav className="flex items-center gap-1">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                    <NavItem icon={Calendar} label="Events" />
                    <NavItem icon={Ticket} label="Tickets" />
                    <NavItem icon={BarChart3} label="Analytics" />
                    <NavItem icon={LifeBuoy} label="Support" />
                </nav>

                <div className="flex items-center gap-4">
                    <button className="p-2.5 hover:bg-muted rounded-full text-muted-foreground">
                        <Search className="h-5 w-5" />
                    </button>
                    <button className="p-2.5 hover:bg-muted rounded-full text-muted-foreground">
                        <Settings className="h-5 w-5" />
                    </button>
                    <div className="h-px w-6 bg-border rotate-90" />
                    <div className="flex items-center gap-3 pl-2 group relative">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">Ali M.</p>
                            <p className="text-xs text-muted-foreground">Manager</p>
                        </div>
                        <button className="h-10 w-10 rounded-full bg-muted overflow-hidden border border-border">
                            <img src="https://ui-avatars.com/api/?name=Ali+M&background=8FB755&color=fff" alt="Profile" />
                        </button>

                        {/* Simple dropdown menu on hover/click */}
                        <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="w-48 bg-white rounded-2xl border border-border shadow-premium p-1.5">
                                <button className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-xl transition-colors">Profile Settings</button>
                                <button className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted rounded-xl transition-colors text-red-500" onClick={onSignOut}>Sign Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-28 pb-12 px-8 max-w-[1600px] mx-auto">
                {children}
            </main>
        </div>
    );
};
