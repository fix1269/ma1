/**
 * AutoMaster Pro Central Runtime Configuration
 * Zero-Server Client-Side Isolation Architecture
 * 
 * Developer Note:
 * Static deployment parameters are set here. Once Production mode is active,
 * owner settings modified via the Admin Dashboard take priority reactively.
 */

export interface AppConfig {
  isDemoMode: boolean;
  databaseProvider: 'demo' | 'firebase' | 'supabase';
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  supabaseConfig?: {
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
  workshopDefault: {
    name: string;
    nameEn: string;
    slogan: string;
    sloganEn: string;
    about: string;
    aboutEn: string;
    phone: string;
    whatsapp: string;
    address: string;
    addressEn: string;
    googleMapsUrl: string;
    logoUrl: string;
    bannerUrl: string;
    primaryColor: string;
    secondaryColor: string;
    adminEmail: string;
  };
}

export const appConfig: AppConfig = {
  // 1. Set to true to run instantly offline using rich pre-filled Egyptian Arabic mock data
  isDemoMode: true,

  // 2. Database Provider Selection ('demo' | 'firebase' | 'supabase')
  databaseProvider: 'demo',

  // Client-side Firebase credentials (if switched to firebase)
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },

  // Client-side Supabase credentials (if switched to supabase)
  supabaseConfig: {
    supabaseUrl: "",
    supabaseAnonKey: ""
  },

  // Master Workshop Default Parameters (Owner overrides via Admin Panel)
  workshopDefault: {
    name: "مركز الأهرام لصيانة وضبط السيارات",
    nameEn: "Al-Ahram Auto Care & Detailing Center",
    slogan: "دقة الصيانة وجودة الأداء منذ عام ٢٠٠٥",
    sloganEn: "Precision Maintenance & Ultimate Performance Since 2005",
    about: "المركز المتخصص الرائد في مصر لخدمات فحص كمبيوتر السيارات، ضبط الميكانيكا، صيانة العفشة والفرامل، رش بوية فرن ودودكو، وغسيل نانو سيراميك وتلميع شامل. نسجل لكل سيارة سجلاً رقمياً معتمداً ودورياً لضمان سلامتك وأداء سيارتك المثالي.",
    aboutEn: "Egypt's premier automotive center specializing in advanced computer diagnostics, mechanical tuning, suspension, oven paint spraying (Doko), and nano-ceramic detailing with a certified digital service log for every vehicle.",
    phone: "+20 100 123 4567",
    whatsapp: "201001234567",
    address: "شارع مصطفى النحاس، أمام محطة وطنية، مدينة نصر، القاهرة",
    addressEn: "Mustafa El-Nahas St, In front of Wataniya Station, Nasr City, Cairo",
    googleMapsUrl: "https://maps.google.com/?q=30.0561,31.3421",
    logoUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&auto=format&fit=crop&q=80",
    primaryColor: "#0284c7", // Sky blue
    secondaryColor: "#f59e0b", // Amber gold
    adminEmail: "admin@alahram-autocare.com",
  }
};

// Also attach to window for developer inspection if desired
if (typeof window !== 'undefined') {
  (window as unknown as { __AUTO_MASTER_CONFIG__: AppConfig }).__AUTO_MASTER_CONFIG__ = appConfig;
}

export default appConfig;
