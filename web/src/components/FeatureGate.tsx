import type { ReactNode } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import type { SubscriptionTier, FeatureKey } from '../config/platformConfig';
import {
    isFeatureAvailable, getMinimumTier, TIER_CONFIG
} from '../config/platformConfig';

/**
 * FeatureGate - Wraps content that requires a specific subscription tier.
 * If the user's tier doesn't have access, shows an upgrade prompt instead.
 */
export const FeatureGate = ({
    children,
    currentTier,
    requiredFeature,
    fallbackMessage,
}: {
    children: ReactNode;
    currentTier: SubscriptionTier;
    requiredFeature: FeatureKey;
    fallbackMessage?: string;
}) => {
    const hasAccess = isFeatureAvailable(currentTier, requiredFeature);

    if (hasAccess) return <>{children}</>;

    const minTier = getMinimumTier(requiredFeature);
    const tierConfig = TIER_CONFIG[minTier];

    return (
        <div className="relative">
            {/* Blurred preview */}
            <div className="pointer-events-none select-none blur-sm opacity-30">
                {children}
            </div>

            {/* Upgrade overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/10 max-w-sm text-center">
                    <div className="h-14 w-14 mx-auto mb-4 bg-gradient-to-br from-primary to-accent-pink rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-black tracking-tighter uppercase italic mb-2">
                        {tierConfig.label} Plan Required
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground mb-4">
                        {fallbackMessage || `This feature is available on the ${tierConfig.label} plan and above.`}
                    </p>
                    <button className="h-10 px-8 bg-gradient-to-r from-primary to-accent-pink text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center gap-2 mx-auto hover:-translate-y-0.5 transition-transform">
                        <Sparkles className="h-3 w-3" />
                        Upgrade to {tierConfig.label}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * TierBadge - Shows the current subscription tier
 */
export const TierBadge = ({ tier }: { tier: SubscriptionTier }) => {
    const colors: Record<SubscriptionTier, string> = {
        starter: 'bg-muted text-muted-foreground border-border/20',
        growth: 'bg-gradient-to-r from-accent-blue/20 to-primary/20 text-primary border-primary/20',
        scale: 'bg-gradient-to-r from-primary/20 to-accent-pink/20 text-accent-pink border-accent-pink/20',
    };

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
            colors[tier]
        )}>
            {tier === 'scale' && <Sparkles className="h-2.5 w-2.5" />}
            {TIER_CONFIG[tier].label}
        </span>
    );
};
