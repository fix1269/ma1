/**
 * AutoMaster Pro - Standalone Developer Configuration File
 * Governs the Developer Portfolio Modal and branding independently.
 * Edit properties here to instantly update your developer profile across the app.
 */

export interface DeveloperConfig {
  name: string;
  title: string;
  email: string;
  whatsapp: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  avatarUrl: string;
  bioAr: string;
  bioEn: string;
  skills: string[];
  copyrightYear: number;
}

export const developerConfig: DeveloperConfig = {
  name: "Eng.Soliman (Soli Dev)",
  title: "Senior Full-Stack & Systems Solutions Architect",
  email: "soli.fly9@gmail.com",
  whatsapp: "201001234567",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  websiteUrl: "https://automaster-pro.dev",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  bioAr: "مهندس برمجيات متخصص في بناء المنظومات السحابية الفائقة الأمان والسرعة وتطبيقات الويب التقدمية (PWA) للشركات ومراكز صيانة السيارات. خبرة أكثر من ٨ سنوات في هندسة الحلول التفاعلية المعزولة بدون خوادم وسجلات الصيانة الرقمية الذكية.",
  bioEn: "Senior Software Engineer specializing in ultra-secure, zero-leakage web architectures, Progressive Web Apps (PWA), and mission-critical automotive ERP solutions with over 8 years of production experience.",
  skills: [
    "Ultra-Secure Client Isolation",
    "PWA & Offline First",
    "Automotive Systems",
    "React / TypeScript / Vite",
    "Firebase & Supabase SDKs",
    "Cloud Native Arch"
  ],
  copyrightYear: new Date().getFullYear(),
};

export default developerConfig;
