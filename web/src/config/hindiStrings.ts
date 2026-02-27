/**
 * Hindi Language Strings for the Vendor Module
 *
 * Provides Hindi translations for key vendor-facing UI elements.
 * Usage: import { hi } from '../config/hindiStrings' and use hi.key
 */

export const hi = {
    // Navigation
    dashboard: 'डैशबोर्ड',
    vendors: 'विक्रेता',
    events: 'कार्यक्रम',
    settings: 'सेटिंग्स',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',

    // Vendor Module
    vendor_list: 'विक्रेता सूची',
    add_vendor: 'विक्रेता जोड़ें',
    vendor_name: 'विक्रेता का नाम',
    vendor_type: 'विक्रेता प्रकार',
    contact_person: 'संपर्क व्यक्ति',
    phone_number: 'फ़ोन नंबर',
    email: 'ईमेल',
    address: 'पता',
    city: 'शहर',
    state: 'राज्य',
    pincode: 'पिन कोड',
    gst_number: 'जीएसटी नंबर',
    pan_number: 'पैन नंबर',

    // Vendor Categories
    caterer: 'केटरर',
    florist: 'फूलवाला',
    decorator: 'सज्जाकार',
    photographer: 'फ़ोटोग्राफ़र',
    videographer: 'वीडियोग्राफ़र',
    dj: 'डीजे',
    lighting: 'लाइटिंग',
    sound: 'साउंड',
    transport: 'परिवहन',
    tent_house: 'टेंट हाउस',
    invitation_cards: 'निमंत्रण पत्र',
    mehndi_artist: 'मेहंदी कलाकार',
    makeup_artist: 'मेकअप आर्टिस्ट',
    pandit: 'पंडित जी',
    band_baaja: 'बैंड बाजा',

    // Status
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    pending: 'लंबित',
    confirmed: 'पुष्ट',
    cancelled: 'रद्द',
    completed: 'पूर्ण',

    // Actions
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    export: 'निर्यात',
    import: 'आयात',
    view_details: 'विवरण देखें',
    send_message: 'संदेश भेजें',
    call: 'कॉल करें',

    // Financial
    total_amount: 'कुल राशि',
    advance_paid: 'अग्रिम भुगतान',
    balance_due: 'शेष राशि',
    payment_status: 'भुगतान स्थिति',
    paid: 'भुगतान किया',
    unpaid: 'अवैतनिक',
    partial: 'आंशिक',
    invoice: 'चालान',
    receipt: 'रसीद',
    gst: 'जीएसटी',
    tds: 'टीडीएस',

    // Booking
    booking_date: 'बुकिंग तिथि',
    event_date: 'कार्यक्रम तिथि',
    delivery_date: 'डिलीवरी तिथि',
    setup_time: 'सेटअप का समय',
    breakdown_time: 'समापन का समय',
    requirements: 'आवश्यकताएं',
    special_notes: 'विशेष नोट्स',

    // Messages
    no_vendors: 'कोई विक्रेता नहीं मिला',
    vendor_added: 'विक्रेता सफलतापूर्वक जोड़ा गया',
    vendor_updated: 'विक्रेता अपडेट किया गया',
    vendor_deleted: 'विक्रेता हटाया गया',
    confirm_delete: 'क्या आप वाकई इसे हटाना चाहते हैं?',
    loading: 'लोड हो रहा है...',
    saving: 'सहेज रहा है...',
    error_occurred: 'एक त्रुटि हुई',

    // NOC related
    police_noc: 'पुलिस एनओसी',
    fire_noc: 'अग्निशमन एनओसी',
    sound_noc: 'ध्वनि अनुमति',
    fssai_license: 'FSSAI लाइसेंस',
    municipal_noc: 'नगर निगम एनओसी',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    under_review: 'समीक्षाधीन',

} as const;

export type HindiKey = keyof typeof hi;
