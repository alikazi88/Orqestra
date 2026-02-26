import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { IndianRupee, TrendingUp, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BudgetRangeProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

const BUDGET_TIERS = [
    { id: 'starter', label: 'Starter', range: '₹5L - ₹15L', icon: IndianRupee, desc: 'Small local events & meetups' },
    { id: 'growth', label: 'Growth', range: '₹15L - ₹50L', icon: TrendingUp, desc: 'Corporate dinners & conferences' },
    { id: 'scale', label: 'Scale', range: '₹50L - ₹2Cr', icon: Zap, desc: 'Large scale concerts & galas' },
    { id: 'enterprise', label: 'Enterprise', range: '₹2Cr+', icon: ShieldCheck, desc: 'Nationwide multi-day summits' },
];

export const BudgetRange = ({ onNext, onBack, initialData }: BudgetRangeProps) => {
    const [selected, setSelected] = useState(initialData?.tier || 'growth');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            onNext({ tier: selected });
            setLoading(false);
        }, 600);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUDGET_TIERS.map((tier) => {
                    const Icon = tier.icon;
                    return (
                        <button
                            key={tier.id}
                            type="button"
                            onClick={() => setSelected(tier.id)}
                            className={cn(
                                "p-6 rounded-3xl border-2 text-left transition-all relative group",
                                selected === tier.id
                                    ? "border-primary bg-primary/5 shadow-premium"
                                    : "border-border hover:border-primary/30"
                            )}
                        >
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                                selected === tier.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                            )}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-lg mb-1">{tier.label}</h4>
                            <p className="text-primary font-bold text-sm mb-2">{tier.range}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{tier.desc}</p>

                            {selected === tier.id && (
                                <div className="absolute top-4 right-4 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                                    <div className="h-3 w-3 bg-white rounded-full" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" type="button" className="flex-1 h-14" onClick={onBack}>
                    Back
                </Button>
                <Button type="submit" className="flex-2 h-14 font-bold" disabled={loading}>
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Continue to Event Types'}
                </Button>
            </div>
        </form>
    );
};
