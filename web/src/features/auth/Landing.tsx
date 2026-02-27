
import { Button } from '../../components/ui/Button';
import {
    Calendar,
    Sparkles,
    Users,
    Layout,
    Shield,
    Zap,
    ChevronRight,
    PlayCircle
} from 'lucide-react';

interface LandingProps {
    onGetStarted: () => void;
    onSignIn: () => void;
}

export const Landing = ({ onGetStarted, onSignIn }: LandingProps) => {
    return (
        <div className="min-h-screen bg-[#fafafa] selection:bg-primary/20">
            {/* Elegant Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Orqestra</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={onSignIn} className="font-semibold px-6">
                            Sign In
                        </Button>
                        <Button onClick={onGetStarted} className="rounded-full px-8 shadow-xl shadow-primary/20 font-bold">
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Sparkles className="h-4 w-4" />
                            <span>Powered by Advanced Intelligence</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Orchestrate Events <br />
                            <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">with Perfect Precision</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            The all-in-one operating system for high-stakes event management.
                            From AI blueprinting to live coordination—manage everything in one premium space.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <Button onClick={onGetStarted} size="lg" className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/20 group">
                                Start Building for Free
                                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-white group">
                                <PlayCircle className="mr-2 h-5 w-5 text-primary" />
                                Watch Demo
                            </Button>
                        </div>
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="relative max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-500">
                        <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10" />
                        <div className="overflow-hidden rounded-3xl border border-white/40 shadow-[0_32px_120px_-12px_rgba(0,0,0,0.12)] bg-white/50 backdrop-blur-sm p-4">
                            <div className="aspect-[16/9] bg-muted/20 rounded-2xl flex items-center justify-center border border-border/50">
                                <div className="text-center p-12">
                                    <Layout className="h-16 w-16 text-muted/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground/50 font-medium">Dashboard Interface Preview</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 tracking-tight">Built for modern organizers</h2>
                        <p className="text-muted-foreground text-lg">Every tool you need to scale your event production agency.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "AI Blueprinting",
                                description: "Generate comprehensive event plans, schedules, and budgets in seconds using advanced Claude technology."
                            },
                            {
                                icon: Users,
                                title: "Team Coordination",
                                description: "Live real-time updates for your entire crew, from directors to technical vendors and field staff."
                            },
                            {
                                icon: Shield,
                                title: "Risk Intelligence",
                                description: "AI-driven risk scoring for vendors and venues, helping you avoid bottlenecks before they happen."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-10 rounded-3xl bg-[#fcfcfc] border border-border/60 hover:border-primary/40 hover:shadow-premium transition-all duration-300 group">
                                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-border/50 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h4 className="text-xl font-bold mb-4 tracking-tight">{feature.title}</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto rounded-[48px] bg-primary p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight"> Ready to level up your <br /> event production?</h2>
                        <p className="text-primary-foreground/90 text-xl mb-12 max-w-2xl mx-auto">
                            Join the elite group of organizers moving their command centers to Orqestra.
                        </p>
                        <Button onClick={onGetStarted} size="lg" className="h-16 px-12 rounded-full text-lg font-bold bg-white text-primary hover:bg-white/90">
                            Create Your Free Account
                        </Button>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-border/40">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5 opacity-60">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Orqestra</span>
                    </div>
                    <p className="text-muted-foreground text-sm">© 2026 Orqestra. The premium event operating system.</p>
                </div>
            </footer>
        </div>
    );
};
