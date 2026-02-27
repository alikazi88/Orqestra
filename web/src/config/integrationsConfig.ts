/**
 * Third-Party Integration Configurations
 *
 * Central configuration for all external service integrations.
 * Each integration has its own config block with API endpoints,
 * required scopes, data mapping, and sync settings.
 */

// ─── Instagram Graph API ────────────────────────────────────────
export const INSTAGRAM_CONFIG = {
    name: 'Instagram',
    description: 'Social listening, UGC collection, and post scheduling',
    apiBase: 'https://graph.instagram.com/v18.0',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    requiredScopes: [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_comments',
        'instagram_manage_insights',
        'pages_show_list',
        'pages_read_engagement',
    ],
    features: {
        ugcCollection: true,
        postScheduling: true,
        insightsTracking: true,
        hashtagMonitoring: true,
        storyMentions: true,
    },
    rateLimit: { requests: 200, windowMinutes: 60 },
    webhookEvents: ['mentions', 'comments', 'story_mentions'],
};

// ─── CRM Integration (Zoho / Salesforce) ────────────────────────
export const CRM_CONFIG = {
    zoho: {
        name: 'Zoho CRM',
        apiBase: 'https://www.zohoapis.com/crm/v5',
        authUrl: 'https://accounts.zoho.com/oauth/v2/auth',
        requiredScopes: ['ZohoCRM.modules.ALL', 'ZohoCRM.settings.ALL'],
        fieldMapping: {
            guest_name: 'Full_Name',
            email: 'Email',
            phone: 'Phone',
            company: 'Company',
            designation: 'Title',
        },
        syncDirection: 'bidirectional' as const,
        syncInterval: 15, // minutes
    },
    salesforce: {
        name: 'Salesforce',
        apiBase: 'https://login.salesforce.com/services/data/v59.0',
        authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
        requiredScopes: ['api', 'refresh_token', 'offline_access'],
        fieldMapping: {
            guest_name: 'Name',
            email: 'Email',
            phone: 'Phone',
            company: 'Account.Name',
            designation: 'Title',
        },
        syncDirection: 'bidirectional' as const,
        syncInterval: 15,
    },
};

// ─── Accounting Integration (Tally / QuickBooks) ─────────────────
export const ACCOUNTING_CONFIG = {
    tally: {
        name: 'Tally Prime',
        description: 'Export vouchers, ledgers, and GST returns to Tally',
        xmlExportFormat: 'Tally XML',
        supportedExports: [
            'Purchase Voucher',
            'Sales Voucher',
            'Payment Voucher',
            'Journal Voucher',
            'GST Summary',
        ],
        gstMapping: {
            cgst: 'CGST @9%',
            sgst: 'SGST @9%',
            igst: 'IGST @18%',
            gst_5: 'GST @5%',
            gst_12: 'GST @12%',
            gst_28: 'GST @28%',
        },
    },
    quickbooks: {
        name: 'QuickBooks Online',
        apiBase: 'https://quickbooks.api.intuit.com/v3',
        authUrl: 'https://appcenter.intuit.com/connect/oauth2',
        requiredScopes: ['com.intuit.quickbooks.accounting'],
        supportedExports: ['Invoice', 'Expense', 'Bill', 'Payment', 'JournalEntry'],
        currencyCode: 'INR',
        syncInterval: 30, // minutes
    },
};

// ─── Slack / Workspace Notifications ─────────────────────────────
export const SLACK_CONFIG = {
    name: 'Slack',
    description: 'Forward workspace notifications to Slack channels',
    apiBase: 'https://slack.com/api',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    requiredScopes: [
        'chat:write',
        'channels:read',
        'incoming-webhook',
    ],
    notificationEvents: [
        { event: 'task_overdue', channel: '#event-alerts', emoji: '🚨' },
        { event: 'vendor_confirmed', channel: '#vendor-updates', emoji: '✅' },
        { event: 'budget_overspend', channel: '#finance-alerts', emoji: '💰' },
        { event: 'guest_rsvp_milestone', channel: '#guest-updates', emoji: '🎉' },
        { event: 'noc_status_change', channel: '#compliance', emoji: '📋' },
        { event: 'new_sponsor', channel: '#sponsorship', emoji: '🤝' },
    ],
    messageFormat: {
        useBlocks: true,
        includeBranding: true,
        threadReplies: true,
    },
};

// ─── Luma / Lu.ma Community Publishing ───────────────────────────
export const LUMA_CONFIG = {
    name: 'Luma (lu.ma)',
    description: 'Publish events to Luma for community discovery and registration',
    apiBase: 'https://api.lu.ma/public/v2',
    fieldMapping: {
        title: 'name',
        description: 'description',
        start_date: 'start_at',
        end_date: 'end_at',
        venue_name: 'geo_address_info.place_id',
        ticket_price: 'ticket_info.price',
        cover_image: 'cover_url',
        capacity: 'event_capacity',
    },
    publishSettings: {
        autoSync: false,
        syncDirection: 'orqestra_to_luma' as const,
        includeTicketing: true,
        includeGuestList: false,
        requireApproval: true,
    },
};

// ─── Integration Registry ────────────────────────────────────────
export const INTEGRATIONS = [
    { key: 'instagram', config: INSTAGRAM_CONFIG, category: 'social', status: 'available' },
    { key: 'zoho', config: CRM_CONFIG.zoho, category: 'crm', status: 'available' },
    { key: 'salesforce', config: CRM_CONFIG.salesforce, category: 'crm', status: 'available' },
    { key: 'tally', config: ACCOUNTING_CONFIG.tally, category: 'accounting', status: 'available' },
    { key: 'quickbooks', config: ACCOUNTING_CONFIG.quickbooks, category: 'accounting', status: 'available' },
    { key: 'slack', config: SLACK_CONFIG, category: 'notifications', status: 'available' },
    { key: 'luma', config: LUMA_CONFIG, category: 'publishing', status: 'available' },
] as const;
