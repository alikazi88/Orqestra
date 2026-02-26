import React from 'react';
// removed unused cn

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Visual / Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/20" />
                {/* Abstract decorative elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-md text-white">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                            <div className="h-5 w-5 bg-primary rounded-sm rotate-45" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Orqestra</span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Design the events of the <span className="text-white/80">future</span>, today.
                    </h1>
                    <p className="text-lg text-white/70 leading-relaxed italic">
                        "Orqestra transformed our production workflow. What used to take weeks of coordination now happens in real-time with AI-powered blueprints."
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full border-2 border-white/20 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Event+Director&background=fff&color=8FB755" alt="Avatar" />
                        </div>
                        <div>
                            <p className="font-bold">Sarah Jenkins</p>
                            <p className="text-sm text-white/60">Creative Director, Apex Events</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
                <div className="w-full max-w-[440px]">
                    <div className="mb-10 text-center lg:text-left">
                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
                            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                                <div className="h-4 w-4 bg-white rounded-sm rotate-45" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Orqestra</span>
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-3">{title}</h2>
                        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                    </div>

                    {children}

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        &copy; 2026 Orqestra Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};
