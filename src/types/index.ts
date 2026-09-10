export type ServiceStatus = 'good' | 'medium' | 'critical';

export interface ServiceItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  status: ServiceStatus;
  serviceDate: string;
  nextDueDate: string;
  nextOdometer?: number;
  notes?: string;
  photoUrl?: string;
  cost?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameEn: string;
  order: number;
  iconName: string;
  defaultItems: string[];
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  nationalId?: string;
  carModel: string; // e.g., "Toyota Corolla 2022"
  plateNumber: string; // e.g., "س ن ر 4589" / "SNR-4589"
  vin: string; // Vehicle Identification Number
  odometer: number; // in Kilometers
  carPhotoUrl?: string; // primary photo
  carPhotos?: string[]; // multiple angles & inspect photos
  notes?: string;
  createdAt: string;
  updatedAt: string;
  services: ServiceItem[];
  customFields?: Record<string, string>;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  plateNumber: string;
  carModel: string;
  currentOdometer: number;
  date: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  notes?: string;
  createdAt: string;
}

export interface PublicService {
  id: string;
  title: string;
  titleEn: string;
  shortDesc: string;
  shortDescEn: string;
  fullDesc: string;
  fullDescEn: string;
  icon: string;
  active: boolean;
  priceEstimate?: string;
  duration?: string;
  warranty?: string;
  image?: string;
}

export interface OfferItem {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  badge: string;
  discountPercent: number;
  expiryDate: string;
  imageUrl: string;
  active: boolean;
  order?: number;
  ctaText?: string;
  ctaLink?: string;
}

export interface MonetizationAd {
  id: string;
  sponsorName: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  targetUrl: string;
  durationSeconds: number; // time in seconds to display
  active: boolean;
  badgeText?: string;
  clicks?: number;
  bannerHeight?: string; // e.g. 'compact' | 'standard' | 'large' | 'auto'
}

export interface CustomPage {
  id: string;
  slug: string; // 'privacy' | 'terms' | 'cookies' | custom
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  isSystem: boolean;
  showInFooter: boolean;
  updatedAt: string;
}

export interface OwnerSettings {
  workshopName: string;
  workshopNameEn: string;
  slogan: string;
  sloganEn: string;
  about: string;
  aboutEn: string;
  phone: string;
  whatsapp: string;
  address: string;
  addressEn: string;
  googleMapsUrl: string;
  websiteUrl?: string; // Dynamic QR code target (GitHub / Netlify / Hostinger)
  logoUrl: string;
  bannerUrl: string;
  primaryColor: string;
  secondaryColor: string;
  adminPasskey: string;
  adminEmail: string;
}

export interface OfflineQueueItem {
  id: string;
  action: 'save_customer' | 'delete_customer' | 'save_invoice' | 'save_settings' | 'save_offers' | 'save_services' | 'save_ads' | 'save_pages';
  payload: unknown;
  timestamp: number;
}
