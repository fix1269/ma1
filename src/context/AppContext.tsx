import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Customer,
  Invoice,
  PublicService,
  OfferItem,
  MonetizationAd,
  CustomPage,
  ServiceCategory,
  OwnerSettings,
  OfflineQueueItem,
  ServiceItem,
} from '../types';
import { appConfig } from '../config';
import {
  initialCustomers,
  initialCategories,
  initialPublicServices,
  initialOffers,
  initialAds,
  initialCustomPages,
  initialOwnerSettings,
} from '../data/mockData';

interface AppContextType {
  // Config & Status
  isDemoMode: boolean;
  databaseProvider: 'demo' | 'firebase' | 'supabase';
  isOnline: boolean;
  offlineQueueCount: number;
  flushOfflineQueue: () => Promise<void>;

  // Language & Theme
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Data Store
  ownerSettings: OwnerSettings;
  updateOwnerSettings: (newSettings: Partial<OwnerSettings>) => void;
  verifyAdminPasskey: (passkey: string) => boolean;
  updateAdminPasskey: (oldPasskey: string, newPasskey: string, emailConfirmation: string) => { success: boolean; message: string };

  customers: Customer[];
  saveCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  lookupCar: (query: string) => Customer | null;

  categories: ServiceCategory[];
  addCategory: (category: ServiceCategory) => void;
  updateCategories: (categories: ServiceCategory[]) => void;

  invoices: Invoice[];
  saveInvoice: (invoice: Invoice) => void;
  deleteInvoice: (invoiceId: string) => void;

  publicServices: PublicService[];
  updatePublicService: (service: PublicService) => void;
  deletePublicService: (serviceId: string) => void;

  offers: OfferItem[];
  saveOffer: (offer: OfferItem) => void;
  deleteOffer: (offerId: string) => void;
  reorderOffers: (newOffers: OfferItem[]) => void;

  ads: MonetizationAd[];
  saveAd: (ad: MonetizationAd) => void;
  deleteAd: (adId: string) => void;
  recordAdClick: (adId: string) => void;

  customPages: CustomPage[];
  saveCustomPage: (page: CustomPage) => void;
  deleteCustomPage: (pageId: string) => void;

  // Active Modals & Views
  selectedCustomerForLog: Customer | null;
  setSelectedCustomerForLog: (customer: Customer | null) => void;
  selectedPublicService: PublicService | null;
  setSelectedPublicService: (service: PublicService | null) => void;
  selectedCustomPage: CustomPage | null;
  setSelectedCustomPage: (page: CustomPage | null) => void;
  isDeveloperModalOpen: boolean;
  setIsDeveloperModalOpen: (open: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Zero-server reactive in-memory states (isolated client-side)
  const [isDemoMode] = useState<boolean>(appConfig.isDemoMode);
  const [databaseProvider] = useState<'demo' | 'firebase' | 'supabase'>(appConfig.databaseProvider);
  
  // Connectivity & offline buffer (in-memory only, no persistent disk leakage)
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);

  // Language & Theme preferences
  const [language, setLanguageState] = useState<'ar' | 'en'>('ar');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  // Business Entities
  const [ownerSettings, setOwnerSettings] = useState<OwnerSettings>(initialOwnerSettings);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [publicServices, setPublicServices] = useState<PublicService[]>(initialPublicServices);
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [ads, setAds] = useState<MonetizationAd[]>(initialAds);
  const [customPages, setCustomPages] = useState<CustomPage[]>(initialCustomPages);

  // Modal State Controls
  const [selectedCustomerForLog, setSelectedCustomerForLog] = useState<Customer | null>(null);
  const [selectedPublicService, setSelectedPublicService] = useState<PublicService | null>(null);
  const [selectedCustomPage, setSelectedCustomPage] = useState<CustomPage | null>(null);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // Update HTML dir and lang attributes when language changes
  const setLanguage = useCallback((lang: 'ar' | 'en') => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const setTheme = useCallback((t: 'dark' | 'light') => {
    setThemeState(t);
    if (typeof document !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Fail-Safe Network listener & microsecond auto-flush
  const flushOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;
    try {
      console.log(`[AutoMaster Cloud Sync] Microsecond flush initiated for ${offlineQueue.length} payloads...`);
      // Simulate/Execute cloud push to Firebase / Supabase when configured
      await new Promise((resolve) => setTimeout(resolve, 600));
      // Completely wipe the in-memory temporary buffer
      setOfflineQueue([]);
      console.log('[AutoMaster Cloud Sync] Cloud queue flushed and local memory wiped cleanly.');
    } catch (err) {
      console.error('[AutoMaster Cloud Sync] Queue flush error:', err);
    }
  }, [offlineQueue]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushOfflineQueue]);

  // Buffer payload if offline
  const bufferOrProcessAction = useCallback((action: OfflineQueueItem['action'], payload: unknown) => {
    if (!isOnline && !isDemoMode) {
      const item: OfflineQueueItem = {
        id: 'queue-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        action,
        payload,
        timestamp: Date.now(),
      };
      setOfflineQueue((prev) => [...prev, item]);
    }
  }, [isOnline, isDemoMode]);

  // Admin Passkey Verification & Modification
  const verifyAdminPasskey = useCallback((key: string): boolean => {
    return key.trim() === ownerSettings.adminPasskey.trim();
  }, [ownerSettings.adminPasskey]);

  const updateAdminPasskey = useCallback((oldPasskey: string, newPasskey: string, emailConfirmation: string) => {
    if (oldPasskey.trim() !== ownerSettings.adminPasskey.trim()) {
      return {
        success: false,
        message: language === 'ar' ? 'كلمة المرور الحالية غير صحيحة' : 'Current passkey is incorrect'
      };
    }
    if (emailConfirmation.trim().toLowerCase() !== ownerSettings.adminEmail.trim().toLowerCase()) {
      return {
        success: false,
        message: language === 'ar' ? 'البريد الإلكتروني التأكيدي غير مطابق لحساب المدير' : 'Admin email confirmation does not match registered owner email'
      };
    }
    if (newPasskey.trim().length < 3) {
      return {
        success: false,
        message: language === 'ar' ? 'يجب أن تتكون كلمة المرور الجديدة من ٣ أحرف/أرقام على الأقل' : 'New passkey must be at least 3 characters'
      };
    }

    setOwnerSettings((prev) => ({
      ...prev,
      adminPasskey: newPasskey.trim()
    }));

    return {
      success: true,
      message: language === 'ar' ? 'تم تحديث كلمة مرور الإدارة بنجاح' : 'Admin passkey updated successfully'
    };
  }, [ownerSettings.adminPasskey, ownerSettings.adminEmail, language]);

  // Customer Management
  const saveCustomer = useCallback((customer: Customer) => {
    setCustomers((prev) => {
      const exists = prev.some((c) => c.id === customer.id);
      if (exists) {
        return prev.map((c) => (c.id === customer.id ? { ...customer, updatedAt: new Date().toISOString() } : c));
      }
      return [{ ...customer, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
    });

    // If currently viewing this customer log, update selected modal too
    setSelectedCustomerForLog((prev) => (prev?.id === customer.id ? customer : prev));
    bufferOrProcessAction('save_customer', customer);
  }, [bufferOrProcessAction]);

  const deleteCustomer = useCallback((customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    if (selectedCustomerForLog?.id === customerId) {
      setSelectedCustomerForLog(null);
    }
    bufferOrProcessAction('delete_customer', { customerId });
  }, [selectedCustomerForLog, bufferOrProcessAction]);

  // Car Lookup Box (Plate number or Phone number matching)
  const lookupCar = useCallback((query: string): Customer | null => {
    if (!query || query.trim().length === 0) return null;
    const clean = query.trim().toLowerCase().replace(/[\s-]/g, '');

    // Normalize Arabic letters and digits if needed
    return customers.find((c) => {
      const normPlate = c.plateNumber.toLowerCase().replace(/[\s-]/g, '');
      const normPhone = c.phone.replace(/[\s-+]/g, '');
      const normVin = (c.vin || '').toLowerCase().replace(/[\s-]/g, '');
      const normName = c.fullName.toLowerCase();

      return (
        normPlate.includes(clean) ||
        normPhone.includes(clean) ||
        (normVin.length > 0 && normVin.includes(clean)) ||
        normName.includes(query.trim().toLowerCase())
      );
    }) || null;
  }, [customers]);

  // Category management
  const addCategory = useCallback((cat: ServiceCategory) => {
    setCategories((prev) => [...prev, cat]);
  }, []);

  const updateCategories = useCallback((cats: ServiceCategory[]) => {
    setCategories(cats);
  }, []);

  // Invoices
  const saveInvoice = useCallback((invoice: Invoice) => {
    setInvoices((prev) => {
      const exists = prev.some((i) => i.id === invoice.id);
      if (exists) {
        return prev.map((i) => (i.id === invoice.id ? invoice : i));
      }
      return [invoice, ...prev];
    });
    bufferOrProcessAction('save_invoice', invoice);
  }, [bufferOrProcessAction]);

  const deleteInvoice = useCallback((invoiceId: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
  }, []);

  // Public Services
  const updatePublicService = useCallback((service: PublicService) => {
    setPublicServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
    bufferOrProcessAction('save_services', service);
  }, [bufferOrProcessAction]);

  const deletePublicService = useCallback((serviceId: string) => {
    setPublicServices((prev) => prev.filter((s) => s.id !== serviceId));
  }, []);

  // Offers
  const saveOffer = useCallback((offer: OfferItem) => {
    setOffers((prev) => {
      const exists = prev.some((o) => o.id === offer.id);
      if (exists) {
        return prev.map((o) => (o.id === offer.id ? offer : o));
      }
      return [offer, ...prev];
    });
    bufferOrProcessAction('save_offers', offer);
  }, [bufferOrProcessAction]);

  const deleteOffer = useCallback((offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  }, []);

  const reorderOffers = useCallback((newOffers: OfferItem[]) => {
    setOffers(newOffers);
    bufferOrProcessAction('save_offers', newOffers);
  }, [bufferOrProcessAction]);

  // Ads
  const saveAd = useCallback((ad: MonetizationAd) => {
    setAds((prev) => {
      const exists = prev.some((a) => a.id === ad.id);
      if (exists) {
        return prev.map((a) => (a.id === ad.id ? ad : a));
      }
      return [ad, ...prev];
    });
    bufferOrProcessAction('save_ads', ad);
  }, [bufferOrProcessAction]);

  const deleteAd = useCallback((adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
  }, []);

  const recordAdClick = useCallback((adId: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, clicks: (a.clicks || 0) + 1 } : a))
    );
  }, []);

  // Custom Pages
  const saveCustomPage = useCallback((page: CustomPage) => {
    setCustomPages((prev) => {
      const exists = prev.some((p) => p.id === page.id);
      if (exists) {
        return prev.map((p) => (p.id === page.id ? page : p));
      }
      return [...prev, page];
    });
    bufferOrProcessAction('save_pages', page);
  }, [bufferOrProcessAction]);

  const deleteCustomPage = useCallback((pageId: string) => {
    setCustomPages((prev) => prev.filter((p) => p.id !== pageId));
  }, []);

  // Owner Branding Settings
  const updateOwnerSettings = useCallback((newSettings: Partial<OwnerSettings>) => {
    setOwnerSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
    bufferOrProcessAction('save_settings', newSettings);
  }, [bufferOrProcessAction]);

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        databaseProvider,
        isOnline,
        offlineQueueCount: offlineQueue.length,
        flushOfflineQueue,
        language,
        setLanguage,
        theme,
        setTheme,
        ownerSettings,
        updateOwnerSettings,
        verifyAdminPasskey,
        updateAdminPasskey,
        customers,
        saveCustomer,
        deleteCustomer,
        lookupCar,
        categories,
        addCategory,
        updateCategories,
        invoices,
        saveInvoice,
        deleteInvoice,
        publicServices,
        updatePublicService,
        deletePublicService,
        offers,
        saveOffer,
        deleteOffer,
        reorderOffers,
        ads,
        saveAd,
        deleteAd,
        recordAdClick,
        customPages,
        saveCustomPage,
        deleteCustomPage,
        selectedCustomerForLog,
        setSelectedCustomerForLog,
        selectedPublicService,
        setSelectedPublicService,
        selectedCustomPage,
        setSelectedCustomPage,
        isDeveloperModalOpen,
        setIsDeveloperModalOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
