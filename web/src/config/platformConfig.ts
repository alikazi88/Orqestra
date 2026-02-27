/**
 * Platform Fee & Subscription Tier Configuration
 * 
 * Orqestra charges:
 * - 1.5% on ticket sales
 * - 3% on facilitated vendor bookings
 * 
 * Subscription Tiers:
 * - Starter: Up to 2 events, basic features
 * - Growth: Up to 10 events, advanced features
 * - Scale: Unlimited events, all features
 */

export type SubscriptionTier = 'starter' | 'growth' | 'scale';

export interface PlatformFees {
    ticketFeePercent: number;
    vendorBookingFeePercent: number;
}

export const PLATFORM_FEES: PlatformFees = {
    ticketFeePercent: 1.5,
    vendorBookingFeePercent: 3.0,
};

export interface TierConfig {
    name: string;
    label: string;
    price: number; // monthly INR
    maxEvents: number | null; // null = unlimited
    features: string[];
    limits: {
        maxGuests: number | null;
        maxVendors: number | null;
        maxTeamMembers: number;
        aiCreditsPerMonth: number;
        customBranding: boolean;
        sponsorshipModule: boolean;
        budgetAlerts: boolean;
        whatsAppIntegration: boolean;
        contractESign: boolean;
        venueLayoutStudio: boolean;
        prioritySupport: boolean;
    };
}

export const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
    starter: {
        name: 'starter',
        label: 'Starter',
        price: 0,
        maxEvents: 2,
        features: [
            'Up to 2 events',
            'Up to 100 guests per event',
            'Basic Task Board',
            'Guest List & RSVP',
            'Budget Builder',
            'Venue Marketplace',
        ],
        limits: {
            maxGuests: 100,
            maxVendors: 5,
            maxTeamMembers: 2,
            aiCreditsPerMonth: 10,
            customBranding: false,
            sponsorshipModule: false,
            budgetAlerts: false,
            whatsAppIntegration: false,
            contractESign: false,
            venueLayoutStudio: false,
            prioritySupport: false,
        },
    },
    growth: {
        name: 'growth',
        label: 'Growth',
        price: 4999,
        maxEvents: 10,
        features: [
            'Up to 10 events',
            'Up to 500 guests per event',
            'AI Critical Path',
            'GST & TDS Tracking',
            'Budget Alerts',
            'Contract e-Sign',
            'WhatsApp Integration',
            'Venue Layout Studio',
            'CSV Import with AI Segmenting',
        ],
        limits: {
            maxGuests: 500,
            maxVendors: 20,
            maxTeamMembers: 5,
            aiCreditsPerMonth: 100,
            customBranding: true,
            sponsorshipModule: true,
            budgetAlerts: true,
            whatsAppIntegration: true,
            contractESign: true,
            venueLayoutStudio: true,
            prioritySupport: false,
        },
    },
    scale: {
        name: 'scale',
        label: 'Scale',
        price: 14999,
        maxEvents: null,
        features: [
            'Unlimited events',
            'Unlimited guests',
            'Full AI Suite',
            'Sponsorship Revenue Tracking',
            'ITC Reports',
            'Role-based Views',
            'Multi-user Realtime Sync',
            'Priority Support',
            'Custom Branding',
            'All Growth features',
        ],
        limits: {
            maxGuests: null,
            maxVendors: null,
            maxTeamMembers: 25,
            aiCreditsPerMonth: -1, // unlimited
            customBranding: true,
            sponsorshipModule: true,
            budgetAlerts: true,
            whatsAppIntegration: true,
            contractESign: true,
            venueLayoutStudio: true,
            prioritySupport: true,
        },
    },
};

export type FeatureKey = keyof TierConfig['limits'];

/**
 * Check if a feature is available for the given tier
 */
export function isFeatureAvailable(tier: SubscriptionTier, feature: FeatureKey): boolean {
    const config = TIER_CONFIG[tier];
    if (!config) return false;
    const val = config.limits[feature];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    return val !== null;
}

/**
 * Get the minimum tier required for a feature
 */
export function getMinimumTier(feature: FeatureKey): SubscriptionTier {
    const tiers: SubscriptionTier[] = ['starter', 'growth', 'scale'];
    for (const tier of tiers) {
        if (isFeatureAvailable(tier, feature)) return tier;
    }
    return 'scale';
}

/**
 * Calculate platform fee for a given transaction
 */
export function calculatePlatformFee(amount: number, type: 'ticket' | 'vendor_booking'): number {
    const rate = type === 'ticket' ? PLATFORM_FEES.ticketFeePercent : PLATFORM_FEES.vendorBookingFeePercent;
    return amount * (rate / 100);
}

/**
 * Format tier for display
 */
export function formatTierPrice(tier: SubscriptionTier): string {
    const config = TIER_CONFIG[tier];
    if (config.price === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(config.price) + '/mo';
}
