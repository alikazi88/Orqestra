import React from 'react';
// removed unused cn

interface OnboardingLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
    title: string;
    subtitle: string;
}

export const OnboardingLayout = ({
    children,
    currentStep,
    totalSteps,
    title,
    subtitle
}: OnboardingLayoutProps) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="h-20 border-b border-border bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                        <div className="h-4 w-4 bg-white rounded-sm rotate-45" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Orqestra</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {currentStep} of {totalSteps}</p>
                        <div className="w-32 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <div className="h-px w-6 bg-border rotate-90" />
                    <button className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        Exit
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-2xl bg-white rounded-[32px] border border-border shadow-premium overflow-hidden">
                    <div className="p-8 sm:p-12 border-b border-border bg-muted/20">
                        <h1 className="text-3xl font-extrabold text-foreground mb-2">{title}</h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                    <div className="p-8 sm:p-12">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer / Trust badges */}
            <footer className="py-8 text-center text-sm text-muted-foreground">
                &copy; 2026 Orqestra Platform. Secure & Multi-tenant Infrastructure.
            </footer>
        </div>
    );
};
