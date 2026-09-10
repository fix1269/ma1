import React, { useState } from 'react';
import {
  X,
  Users,
  FileText,
  Palette,
  Layers,
  Sparkles,
  Tag,
  Megaphone,
  Plus,
  Trash2,
  Edit3,
  Search,
  Upload,
  Save,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  DollarSign,
  Printer,
  MessageCircle,
  Eye,
  Key,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  GripVertical,
  FileSpreadsheet,
  Maximize2,
  ArrowUp,
  ArrowDown,
  QrCode,
  Globe,
  FolderTree,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  Customer,
  ServiceItem,
  ServiceCategory,
  Invoice,
  InvoiceLineItem,
  PublicService,
  OfferItem,
  MonetizationAd,
  CustomPage,
  OwnerSettings,
} from '../types';
import { compressClientImage } from '../utils/imageCompressor';
import { generateCustomerWhatsAppReminder, openWhatsAppChat } from '../utils/whatsapp';
import { exportCustomersToExcel, exportInvoicesToExcel } from '../utils/excelExporter';
import { ImageLightboxModal } from './ImageLightboxModal';
import { CommercialInvoiceModal } from './CommercialInvoiceModal';

type AdminTab =
  | 'customers'
  | 'invoices'
  | 'branding'
  | 'pages'
  | 'services'
  | 'offers'
  | 'ads';

type TimeFilter = 'all' | 'annual' | 'monthly' | 'daily';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    customers,
    saveCustomer,
    deleteCustomer,
    categories,
    addCategory,
    updateCategories,
    invoices,
    saveInvoice,
    deleteInvoice,
    ownerSettings,
    updateOwnerSettings,
    updateAdminPasskey,
    publicServices,
    updatePublicService,
    offers,
    saveOffer,
    deleteOffer,
    reorderOffers,
    ads,
    saveAd,
    deleteAd,
    customPages,
    saveCustomPage,
    deleteCustomPage,
    setSelectedCustomerForLog,
    language,
  } = useApp();

  const isArabic = language === 'ar';
  const [activeTab, setActiveTab] = useState<AdminTab>('customers');

  // Temporal Archive Filter State (Annual, Monthly, Daily)
  const [customerTimeFilter, setCustomerTimeFilter] = useState<TimeFilter>('all');
  const [invoiceTimeFilter, setInvoiceTimeFilter] = useState<TimeFilter>('all');

  // Lightbox Modal for Car Photos
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  // Commercial Invoice Full Preview Modal
  const [viewingCommercialInvoice, setViewingCommercialInvoice] = useState<Invoice | null>(null);

  // Customer State
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [newCustomCategoryName, setNewCustomCategoryName] = useState('');
  const [newCustomFieldName, setNewCustomFieldName] = useState('');
  const [selectedCatForField, setSelectedCatForField] = useState('fluids');

  // Invoice State
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Branding State
  const [brandingForm, setBrandingForm] = useState<OwnerSettings>({ ...ownerSettings });
  const [passkeyForm, setPasskeyForm] = useState({ oldKey: '', newKey: '', confirmEmail: '' });
  const [passkeyFeedback, setPasskeyFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [brandingSavedNotice, setBrandingSavedNotice] = useState(false);

  // Offers State
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);

  // Ads State
  const [editingAd, setEditingAd] = useState<MonetizationAd | null>(null);
  const [isCreatingAd, setIsCreatingAd] = useState(false);

  // Custom Pages State
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  if (!isAdminDashboardOpen) return null;

  // Image Upload handler with enforced client-side compression pipeline
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImage(true);
    try {
      const res = await compressClientImage(file, { maxSizeMB: 0.15, maxWidthOrHeight: 1024 });
      onSuccess(res.dataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Filtered Customers by search
  const filteredCustomers = customers.filter((c) => {
    const q = customerSearchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.plateNumber.toLowerCase().includes(q) ||
      c.carModel.toLowerCase().includes(q)
    );
  });

  // Temporal Archive Filtering (Annual, Monthly, Daily)
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();
  const curDate = now.getDate();

  const timeFilteredCustomers = filteredCustomers.filter((c) => {
    if (customerTimeFilter === 'all') return true;
    const d = new Date(c.updatedAt || c.createdAt || Date.now());
    if (isNaN(d.getTime())) return true;
    if (customerTimeFilter === 'annual') return d.getFullYear() === curYear;
    if (customerTimeFilter === 'monthly') return d.getFullYear() === curYear && d.getMonth() === curMonth;
    if (customerTimeFilter === 'daily') return d.getFullYear() === curYear && d.getMonth() === curMonth && d.getDate() === curDate;
    return true;
  });

  const timeFilteredInvoices = invoices.filter((inv) => {
    if (invoiceTimeFilter === 'all') return true;
    const d = new Date(inv.date || inv.createdAt || Date.now());
    if (isNaN(d.getTime())) return true;
    if (invoiceTimeFilter === 'annual') return d.getFullYear() === curYear;
    if (invoiceTimeFilter === 'monthly') return d.getFullYear() === curYear && d.getMonth() === curMonth;
    if (invoiceTimeFilter === 'daily') return d.getFullYear() === curYear && d.getMonth() === curMonth && d.getDate() === curDate;
    return true;
  });

  // Initialize new customer template
  const initNewCustomer = (): Customer => ({
    id: 'cust-' + Date.now(),
    fullName: '',
    phone: '',
    carModel: '',
    plateNumber: '',
    vin: '',
    odometer: 0,
    carPhotoUrl: '',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    services: [
      {
        id: 'srv-' + Date.now() + '-1',
        name: 'زيت المحرك التخليقي (Engine Oil)',
        nameEn: 'Synthetic Engine Oil',
        category: 'fluids',
        status: 'good',
        serviceDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        nextOdometer: 10000,
        notes: '',
      },
      {
        id: 'srv-' + Date.now() + '-2',
        name: 'فلتر زيت المحرك الأصلي (Oil Filter)',
        nameEn: 'OEM Oil Filter',
        category: 'filters',
        status: 'good',
        serviceDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        notes: '',
      },
      {
        id: 'srv-' + Date.now() + '-3',
        name: 'فحمات وتيل الفرامل (Brake Pads)',
        nameEn: 'Brake Pads',
        category: 'brakes_suspension',
        status: 'medium',
        serviceDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        notes: '',
      }
    ],
  });

  // Initialize new invoice template
  const initNewInvoice = (customer?: Customer): Invoice => {
    const dateStr = new Date().toISOString().split('T')[0];
    return {
      id: 'inv-' + Date.now(),
      invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
      customerId: customer ? customer.id : '',
      customerName: customer ? customer.fullName : '',
      customerPhone: customer ? customer.phone : '',
      plateNumber: customer ? customer.plateNumber : '',
      carModel: customer ? customer.carModel : '',
      currentOdometer: customer ? customer.odometer : 0,
      date: dateStr,
      items: [
        { id: 'item-1', description: 'تغيير زيت المحرك التخليقي 10,000 كم', qty: 1, unitPrice: 1800, total: 1800 },
        { id: 'item-2', description: 'فلتر زيت أصلي ياباني', qty: 1, unitPrice: 350, total: 350 },
        { id: 'item-3', description: 'مصنعية فحص كمبيوتر وضبط زوايا', qty: 1, unitPrice: 300, total: 300 },
      ],
      subtotal: 2450,
      taxPercent: 14,
      taxAmount: 343,
      discountPercent: 5,
      discountAmount: 122.5,
      total: 2670.5,
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };
  };

  // Recalculate invoice totals
  const recalculateInvoice = (inv: Invoice): Invoice => {
    const subtotal = inv.items.reduce((acc, it) => acc + (it.qty * it.unitPrice), 0);
    const discountAmount = (subtotal * (inv.discountPercent || 0)) / 100;
    const taxableBase = Math.max(0, subtotal - discountAmount);
    const taxAmount = (taxableBase * (inv.taxPercent || 0)) / 100;
    const total = taxableBase + taxAmount;

    return {
      ...inv,
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[94vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isArabic ? 'لوحة إدارة الورشة والسجلات الرقمية' : 'Workshop Master Admin Control'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-bold">
                  Zero-Server Isolated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isArabic ? ownerSettings.workshopName : ownerSettings.workshopNameEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body with Tabs Layout */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Navigation Sidebar */}
          <aside className="w-full md:w-64 bg-slate-950/80 border-b md:border-b-0 md:border-e border-slate-800 p-3 md:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
            <button
              onClick={() => { setActiveTab('customers'); setEditingCustomer(null); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isArabic ? 'العملاء وسجلات الصيانة' : 'Customers & Service Logs'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('invoices'); setEditingInvoice(null); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'invoices'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>{isArabic ? 'الفواتير والحسابات' : 'Invoices Generator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>{isArabic ? 'تخصيص الهوية والألوان' : 'Store Branding'}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'services'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isArabic ? 'إدارة كروت الخدمات' : 'Public Services (6)'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('offers'); setEditingOffer(null); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'offers'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>{isArabic ? 'سلايدر العروض والخصومات' : 'Offers Slider'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('ads'); setEditingAd(null); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'ads'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>{isArabic ? 'بنرات الإعلانات والرعاة' : 'Monetization Ads'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('pages'); setEditingPage(null); }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeTab === 'pages'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-950/60'
                  : 'text-slate-300 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isArabic ? 'منشئ الصفحات والسياسات' : 'Custom Pages Builder'}</span>
            </button>
          </aside>

          {/* Tab Content Container */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto bg-slate-900">
            {/* TAB 1: CUSTOMERS & DIGITAL SERVICE LOGS */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                {!editingCustomer ? (
                  <>
                    {/* Header Controls */}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                          <input
                            type="text"
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            placeholder={isArabic ? 'بحث بالاسم، رقم اللوحة، الهاتف، الموديل...' : 'Search by Name, Plate, Phone...'}
                            className="w-full ps-9 pe-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => exportCustomersToExcel(timeFilteredCustomers, ownerSettings.workshopName)}
                            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                            title={isArabic ? 'تصدير بيانات السجلات إلى ملف Excel (CSV)' : 'Export to Excel'}
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>{isArabic ? 'تصدير إكسيل' : 'Export Excel'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingCustomer(initNewCustomer());
                              setIsAddingNewCustomer(true);
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-sky-950/50"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{isArabic ? 'إضافة عميل وسيارة' : 'Add Customer'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Temporal Archive Filter Folders */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                        <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
                          <FolderTree className="w-3.5 h-3.5 text-sky-400" />
                          <span>{isArabic ? 'الأرشيف الزمني:' : 'Archive:'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCustomerTimeFilter('all')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            customerTimeFilter === 'all'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? `كافة السجلات (${filteredCustomers.length})` : `All Records (${filteredCustomers.length})`}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerTimeFilter('annual')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            customerTimeFilter === 'annual'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? `أرشيف السنة الحالية (${new Date().getFullYear()})` : `Annual Archive (${new Date().getFullYear()})`}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerTimeFilter('monthly')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            customerTimeFilter === 'monthly'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? 'أرشيف الشهر الحالي' : 'Monthly Archive'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerTimeFilter('daily')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            customerTimeFilter === 'daily'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? 'سجلات اليوم' : 'Daily Logs'}
                        </button>
                      </div>
                    </div>

                    {/* Customers List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {timeFilteredCustomers.map((cust) => {
                        const criticalCount = cust.services.filter((s) => s.status === 'critical').length;
                        const allPhotos = [
                          cust.carPhotoUrl,
                          ...(cust.carPhotos || []),
                        ].filter((p): p is string => Boolean(p));

                        return (
                          <div
                            key={cust.id}
                            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition shadow-md"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                {allPhotos.length > 0 ? (
                                  <div className="relative group shrink-0">
                                    <img
                                      src={allPhotos[0]}
                                      alt={cust.carModel}
                                      onClick={() => {
                                        setLightboxImages(allPhotos);
                                        setLightboxInitialIndex(0);
                                      }}
                                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 cursor-pointer hover:opacity-90 transition"
                                    />
                                    {allPhotos.length > 1 && (
                                      <span className="absolute -bottom-1 -end-1 px-1.5 py-0.2 bg-sky-600 text-white text-[10px] font-bold rounded-md font-mono">
                                        +{allPhotos.length}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="w-14 h-14 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700">
                                    <Users className="w-6 h-6" />
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-base font-black text-white">{cust.fullName}</h4>
                                  <p className="text-xs text-sky-400 font-semibold">{cust.carModel}</p>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-200">
                                      {cust.plateNumber}
                                    </span>
                                    <span>{cust.phone}</span>
                                  </div>
                                </div>
                              </div>

                              {criticalCount > 0 && (
                                <span className="px-2 py-1 bg-red-950 text-red-300 border border-red-800 text-[11px] font-bold rounded-lg shrink-0 animate-pulse">
                                  {criticalCount} {isArabic ? 'صيانة عاجلة' : 'Due'}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-slate-850 flex items-center justify-between gap-2 text-xs">
                              <button
                                onClick={() => setSelectedCustomerForLog(cust)}
                                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold"
                              >
                                <Eye className="w-4 h-4" />
                                <span>{isArabic ? 'معاينة السجل' : 'View Log'}</span>
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const msg = generateCustomerWhatsAppReminder(cust, ownerSettings, cust.services);
                                    openWhatsAppChat(cust.phone, msg);
                                  }}
                                  className="p-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 rounded-lg transition"
                                  title="Send WhatsApp Reminder"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCustomer({ ...cust });
                                    setIsAddingNewCustomer(false);
                                  }}
                                  className="p-2 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
                                  title="Edit Customer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(isArabic ? 'هل أنت متأكد من حذف هذا العميل وسجلاته؟' : 'Delete customer and all service logs?')) {
                                      deleteCustomer(cust.id);
                                    }
                                  }}
                                  className="p-2 bg-red-950/50 hover:bg-red-900 text-red-400 rounded-lg transition"
                                  title="Delete Customer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* Customer Edit / Create Form */
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-white">
                        {isAddingNewCustomer
                          ? (isArabic ? 'إضافة عميل وسيارة جديدة' : 'Add New Customer')
                          : (isArabic ? `تعديل سجل: ${editingCustomer.fullName}` : `Edit: ${editingCustomer.fullName}`)}
                      </h4>
                      <button
                        onClick={() => setEditingCustomer(null)}
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 rounded-lg"
                      >
                        {isArabic ? 'إلغاء والعودة' : 'Cancel & Return'}
                      </button>
                    </div>

                    {/* Customer Info Card */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <h5 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                        {isArabic ? 'بيانات العميل والسيارة الأساسية' : 'Vehicle & Customer Identity'}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">{isArabic ? 'الاسم بالكامل' : 'Full Name'}</label>
                          <input
                            type="text"
                            value={editingCustomer.fullName}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, fullName: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">{isArabic ? 'رقم الهاتف / الواتساب' : 'Phone'}</label>
                          <input
                            type="text"
                            value={editingCustomer.phone}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">{isArabic ? 'موديل وسنة السيارة' : 'Car Model'}</label>
                          <input
                            type="text"
                            value={editingCustomer.carModel}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, carModel: e.target.value })}
                            placeholder="e.g. Toyota Corolla 2022"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">{isArabic ? 'رقم اللوحة' : 'Plate Number'}</label>
                          <input
                            type="text"
                            value={editingCustomer.plateNumber}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, plateNumber: e.target.value })}
                            placeholder="e.g. أ ب ج ٤٥٨٩"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">{isArabic ? 'العداد الحالي (كم)' : 'Odometer (KM)'}</label>
                          <input
                            type="number"
                            value={editingCustomer.odometer || 0}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, odometer: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-bold mb-1">{isArabic ? 'رقم الشاسيه (VIN)' : 'VIN Number'}</label>
                          <input
                            type="text"
                            value={editingCustomer.vin || ''}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, vin: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>

                      {/* Car Multi-Angle Photos with Client-Side Compression & Lightbox */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-sky-400" />
                            <span>{isArabic ? 'صور السيارة من زوايا متعددة (أمام، خلف، صالون، محرك...)' : 'Multi-Angle Car Photos (Front, Rear, Cabin, Engine)'}</span>
                          </label>

                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow transition">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isCompressingImage ? 'جاري الضغط...' : (isArabic ? 'إضافة صورة بزاوية' : 'Add Photo')}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (dataUrl) => {
                                  const existing = editingCustomer.carPhotos || [];
                                  const updatedPhotos = [...existing, dataUrl];
                                  setEditingCustomer({
                                    ...editingCustomer,
                                    carPhotoUrl: editingCustomer.carPhotoUrl || dataUrl,
                                    carPhotos: updatedPhotos,
                                  });
                                })
                              }
                            />
                          </label>
                        </div>

                        {/* Gallery of photos */}
                        {((editingCustomer.carPhotos && editingCustomer.carPhotos.length > 0) || editingCustomer.carPhotoUrl) ? (
                          <div className="flex flex-wrap gap-3">
                            {([editingCustomer.carPhotoUrl, ...(editingCustomer.carPhotos || [])].filter((p): p is string => Boolean(p))).filter((v, i, a) => a.indexOf(v) === i).map((imgUrl, index, arr) => (
                              <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-700 w-24 h-24 bg-slate-900">
                                <img
                                  src={imgUrl}
                                  alt={`Angle ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLightboxImages(arr);
                                      setLightboxInitialIndex(index);
                                    }}
                                    className="p-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-500"
                                    title={isArabic ? 'تكبير وعرض' : 'Zoom & View'}
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = (editingCustomer.carPhotos || []).filter((p) => p !== imgUrl);
                                      setEditingCustomer({
                                        ...editingCustomer,
                                        carPhotoUrl: editingCustomer.carPhotoUrl === imgUrl ? (filtered[0] || '') : editingCustomer.carPhotoUrl,
                                        carPhotos: filtered,
                                      });
                                    }}
                                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500"
                                    title={isArabic ? 'حذف الصورة' : 'Delete Photo'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-dashed border-slate-700 text-center text-xs text-slate-400">
                            {isArabic ? 'لم يتم رفع صور للسيارة بعد. يمكنك رفع حتى ٦ صور لتوثيق حالة السيارة قبل وبعد الصيانة.' : 'No photos added yet. Upload multi-angle photos for full service log documentation.'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Accordion Service Lines Editor */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-black text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-sky-400" />
                          <span>{isArabic ? 'بنود وجداول الصيانة الدورية' : 'Maintenance Line Items'}</span>
                        </h5>

                        {/* Add Custom Maintenance Line Item */}
                        <button
                          type="button"
                          onClick={() => {
                            const newService: ServiceItem = {
                              id: 'srv-' + Date.now(),
                              name: isArabic ? 'بند صيانة مخصص' : 'Custom Service Item',
                              nameEn: 'Custom Item',
                              category: categories[0]?.id || 'fluids',
                              status: 'good',
                              serviceDate: new Date().toISOString().split('T')[0],
                              nextDueDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
                            };
                            setEditingCustomer({
                              ...editingCustomer,
                              services: [...editingCustomer.services, newService],
                            });
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white text-xs font-bold rounded-lg border border-sky-500/40 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isArabic ? 'إضافة بند صيانة' : 'Add Item'}</span>
                        </button>
                      </div>

                      {/* Render Services grouped by category */}
                      {categories.map((category) => {
                        const items = editingCustomer.services.filter((s) => s.category === category.id);
                        return (
                          <div key={category.id} className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
                            <h6 className="text-xs font-bold text-sky-300 flex items-center justify-between">
                              <span>{isArabic ? category.name : category.nameEn}</span>
                              <span className="font-mono text-slate-500">({items.length})</span>
                            </h6>

                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                              >
                                <div className="sm:col-span-4">
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                      const updated = editingCustomer.services.map((s) =>
                                        s.id === item.id ? { ...s, name: e.target.value } : s
                                      );
                                      setEditingCustomer({ ...editingCustomer, services: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-white outline-none"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <select
                                    value={item.status}
                                    onChange={(e) => {
                                      const updated = editingCustomer.services.map((s) =>
                                        s.id === item.id ? { ...s, status: e.target.value as any } : s
                                      );
                                      setEditingCustomer({ ...editingCustomer, services: updated });
                                    }}
                                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold outline-none text-white"
                                  >
                                    <option value="good">🟢 {isArabic ? 'سليم' : 'Good'}</option>
                                    <option value="medium">🟡 {isArabic ? 'متابعة' : 'Medium'}</option>
                                    <option value="critical">🔴 {isArabic ? 'عاجل' : 'Critical'}</option>
                                  </select>
                                </div>

                                <div className="sm:col-span-3">
                                  <input
                                    type="date"
                                    value={item.nextDueDate || ''}
                                    onChange={(e) => {
                                      const updated = editingCustomer.services.map((s) =>
                                        s.id === item.id ? { ...s, nextDueDate: e.target.value } : s
                                      );
                                      setEditingCustomer({ ...editingCustomer, services: updated });
                                    }}
                                    className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
                                    title="Next Due Date"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <input
                                    type="number"
                                    value={item.cost || ''}
                                    placeholder={isArabic ? 'التكلفة ج.م' : 'Cost EGP'}
                                    onChange={(e) => {
                                      const updated = editingCustomer.services.map((s) =>
                                        s.id === item.id ? { ...s, cost: parseFloat(e.target.value) || 0 } : s
                                      );
                                      setEditingCustomer({ ...editingCustomer, services: updated });
                                    }}
                                    className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-amber-400"
                                  />
                                </div>

                                <div className="sm:col-span-1 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = editingCustomer.services.filter((s) => s.id !== item.id);
                                      setEditingCustomer({ ...editingCustomer, services: updated });
                                    }}
                                    className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-md"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    {/* Save Customer Button */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingCustomer(null)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl"
                      >
                        {isArabic ? 'إلغاء' : 'Cancel'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!editingCustomer.fullName || !editingCustomer.plateNumber) {
                            alert(isArabic ? 'يرجى كتابة اسم العميل ورقم اللوحة' : 'Please provide full name and plate number');
                            return;
                          }
                          saveCustomer(editingCustomer);
                          setEditingCustomer(null);
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isArabic ? 'حفظ السجل الرقمي' : 'Save Service Log'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INVOICES GENERATOR */}
            {activeTab === 'invoices' && (
              <div className="space-y-6">
                {!editingInvoice ? (
                  <>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-black text-white">
                            {isArabic ? 'سجل الفواتير وأوامر الصيانة التجارية' : 'Invoices & Billing'}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {isArabic ? 'إصدار فواتير ضريبية معتمدة مزودة برمز QR Code للتحقق الفوري' : 'Tax-compliant invoices with verifiable dynamic QR codes'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => exportInvoicesToExcel(timeFilteredInvoices, ownerSettings.workshopName)}
                            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                            title={isArabic ? 'تصدير الفواتير إلى ملف Excel (CSV)' : 'Export Invoices to Excel'}
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>{isArabic ? 'تصدير إكسيل' : 'Export Excel'}</span>
                          </button>

                          <button
                            onClick={() => {
                              const newInv = initNewInvoice(customers[0]);
                              setEditingInvoice(newInv);
                              setIsCreatingInvoice(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{isArabic ? 'إنشاء فاتورة جديدة' : 'New Invoice'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Invoices Temporal Archive Filter */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                        <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
                          <FolderTree className="w-3.5 h-3.5 text-sky-400" />
                          <span>{isArabic ? 'الأرشيف المالي:' : 'Billing Archive:'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setInvoiceTimeFilter('all')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            invoiceTimeFilter === 'all'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? `كافة الفواتير (${invoices.length})` : `All Invoices (${invoices.length})`}
                        </button>
                        <button
                          type="button"
                          onClick={() => setInvoiceTimeFilter('annual')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            invoiceTimeFilter === 'annual'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? `أرشيف السنة (${new Date().getFullYear()})` : `Annual (${new Date().getFullYear()})`}
                        </button>
                        <button
                          type="button"
                          onClick={() => setInvoiceTimeFilter('monthly')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            invoiceTimeFilter === 'monthly'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? 'أرشيف الشهر الحالي' : 'Monthly'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setInvoiceTimeFilter('daily')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                            invoiceTimeFilter === 'daily'
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isArabic ? 'فواتير اليوم' : 'Daily'}
                        </button>
                      </div>
                    </div>

                    {timeFilteredInvoices.length > 0 ? (
                      <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                        {timeFilteredInvoices.map((inv) => (
                          <div key={inv.id} className="p-4 flex items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-sky-400">{inv.invoiceNumber}</span>
                                <span className="text-xs text-slate-400">{inv.date}</span>
                              </div>
                              <h5 className="font-bold text-white text-sm mt-0.5">{inv.customerName} — {inv.plateNumber}</h5>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-amber-400 text-base">{inv.total.toLocaleString()} EGP</span>
                              
                              {/* View / Print Official Commercial Tax Invoice with QR */}
                              <button
                                type="button"
                                onClick={() => setViewingCommercialInvoice(inv)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs rounded-lg transition border border-slate-700"
                                title={isArabic ? 'معاينة وطباعة الفاتورة التجارية المعتمدة مع QR' : 'View Commercial Invoice'}
                              >
                                <QrCode className="w-4 h-4" />
                                <span className="hidden sm:inline">{isArabic ? 'الفاتورة والـ QR' : 'Invoice & QR'}</span>
                              </button>

                              <button
                                onClick={() => { setEditingInvoice({ ...inv }); setIsCreatingInvoice(false); }}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                                title={isArabic ? 'تعديل الفاتورة' : 'Edit Invoice'}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteInvoice(inv.id)}
                                className="p-2 bg-red-950 text-red-400 rounded-lg"
                                title={isArabic ? 'حذف الفاتورة' : 'Delete Invoice'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800">
                        <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-300">
                          {isArabic ? 'لم يتم العثور على أية فواتير في هذا الأرشيف' : 'No invoices found in this archive'}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  /* Invoice Editor */
                  <div className="space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <h4 className="text-lg font-black text-white">{isArabic ? 'تحرير الفاتورة' : 'Invoice Editor'}</h4>
                        <p className="text-xs text-sky-400 font-mono">{editingInvoice.invoiceNumber}</p>
                      </div>
                      <button onClick={() => setEditingInvoice(null)} className="text-xs text-slate-400 hover:text-white">
                        {isArabic ? 'إغلاق' : 'Close'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'اسم العميل' : 'Customer Name'}</label>
                        <input
                          type="text"
                          value={editingInvoice.customerName}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, customerName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'رقم اللوحة' : 'Plate Number'}</label>
                        <input
                          type="text"
                          value={editingInvoice.plateNumber}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, plateNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'تاريخ الفاتورة' : 'Date'}</label>
                        <input
                          type="date"
                          value={editingInvoice.date}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, date: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Invoice Line Items */}
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-slate-300 uppercase">{isArabic ? 'بنود الصيانة وقطع الغيار' : 'Line Items'}</h5>
                        <button
                          type="button"
                          onClick={() => {
                            const newItem: InvoiceLineItem = {
                              id: 'it-' + Date.now(),
                              description: 'بند جديد',
                              qty: 1,
                              unitPrice: 100,
                              total: 100,
                            };
                            const updated = recalculateInvoice({
                              ...editingInvoice,
                              items: [...editingInvoice.items, newItem],
                            });
                            setEditingInvoice(updated);
                          }}
                          className="text-xs text-sky-400 font-bold hover:underline"
                        >
                          + {isArabic ? 'إضافة سطر' : 'Add Line'}
                        </button>
                      </div>

                      {editingInvoice.items.map((item, idx) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-900 p-2 rounded-xl">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const updatedItems = editingInvoice.items.map((it) =>
                                it.id === item.id ? { ...it, description: e.target.value } : it
                              );
                              setEditingInvoice(recalculateInvoice({ ...editingInvoice, items: updatedItems }));
                            }}
                            className="col-span-6 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                          />
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 1;
                              const updatedItems = editingInvoice.items.map((it) =>
                                it.id === item.id ? { ...it, qty, total: qty * it.unitPrice } : it
                              );
                              setEditingInvoice(recalculateInvoice({ ...editingInvoice, items: updatedItems }));
                            }}
                            className="col-span-2 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono text-center"
                          />
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const unitPrice = parseFloat(e.target.value) || 0;
                              const updatedItems = editingInvoice.items.map((it) =>
                                it.id === item.id ? { ...it, unitPrice, total: item.qty * unitPrice } : it
                              );
                              setEditingInvoice(recalculateInvoice({ ...editingInvoice, items: updatedItems }));
                            }}
                            className="col-span-3 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-amber-400 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedItems = editingInvoice.items.filter((it) => it.id !== item.id);
                              setEditingInvoice(recalculateInvoice({ ...editingInvoice, items: updatedItems }));
                            }}
                            className="col-span-1 text-red-400 p-1"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Invoice Calculations */}
                    <div className="p-4 bg-slate-900 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>{isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                        <span className="font-mono">{editingInvoice.subtotal.toLocaleString()} EGP</span>
                      </div>
                      <div className="flex justify-between text-slate-300 items-center">
                        <span>{isArabic ? 'الخصم (%):' : 'Discount (%):'}</span>
                        <input
                          type="number"
                          value={editingInvoice.discountPercent || 0}
                          onChange={(e) =>
                            setEditingInvoice(
                              recalculateInvoice({
                                ...editingInvoice,
                                discountPercent: parseFloat(e.target.value) || 0,
                              })
                            )
                          }
                          className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded font-mono text-end"
                        />
                      </div>
                      <div className="flex justify-between text-slate-300 items-center">
                        <span>{isArabic ? 'ضريبة القيمة المضافة (%):' : 'VAT (%):'}</span>
                        <input
                          type="number"
                          value={editingInvoice.taxPercent || 0}
                          onChange={(e) =>
                            setEditingInvoice(
                              recalculateInvoice({
                                ...editingInvoice,
                                taxPercent: parseFloat(e.target.value) || 0,
                              })
                            )
                          }
                          className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded font-mono text-end"
                        />
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-amber-400">
                        <span>{isArabic ? 'الإجمالي النهائي المطلوب:' : 'Grand Total:'}</span>
                        <span className="font-mono text-base">{editingInvoice.total.toLocaleString()} EGP</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          saveInvoice(editingInvoice);
                          setEditingInvoice(null);
                        }}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs sm:text-sm rounded-xl"
                      >
                        {isArabic ? 'حفظ الفاتورة' : 'Save Invoice'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STORE BRANDING & SECURITY CUSTOMIZER */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-white">
                    {isArabic ? 'تخصيص هوية الورشة والألوان وكلمة المرور' : 'Store Branding & Passkey Customizer'}
                  </h4>
                  {brandingSavedNotice && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {isArabic ? 'تم حفظ التعديلات بنجاح!' : 'Saved successfully!'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Workshop Names & Contact */}
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <h5 className="text-xs font-black text-sky-400 uppercase">{isArabic ? 'بيانات المركز' : 'Workshop Info'}</h5>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'اسم الورشة (عربي)' : 'Name (Arabic)'}</label>
                      <input
                        type="text"
                        value={brandingForm.workshopName}
                        onChange={(e) => setBrandingForm({ ...brandingForm, workshopName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'اسم الورشة (إنجليزي)' : 'Name (English)'}</label>
                      <input
                        type="text"
                        value={brandingForm.workshopNameEn}
                        onChange={(e) => setBrandingForm({ ...brandingForm, workshopNameEn: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'شعار / سلوجان المركز' : 'Slogan'}</label>
                      <input
                        type="text"
                        value={brandingForm.slogan}
                        onChange={(e) => setBrandingForm({ ...brandingForm, slogan: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'نص من نحن (نبذة عن المركز)' : 'About Us Text'}</label>
                      <textarea
                        rows={3}
                        value={brandingForm.about}
                        onChange={(e) => setBrandingForm({ ...brandingForm, about: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'رابط الموقع الإلكتروني / الدومين (لرمز الـ QR في الفواتير)' : 'Website URL (Embedded in Invoice QR)'}</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                        <input
                          type="url"
                          placeholder="e.g. https://yourworkshop.com or https://username.github.io/app"
                          value={brandingForm.websiteUrl || ''}
                          onChange={(e) => setBrandingForm({ ...brandingForm, websiteUrl: e.target.value })}
                          className="w-full ps-9 pe-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {isArabic
                          ? 'يتم تضمين هذا الرابط داخل رمز الاستجابة السريعة (QR Code) على الفواتير وتقارير الصيانة للتحقق الفوري للعملاء.'
                          : 'This URL is embedded in QR codes on official commercial invoices & logs for instant verification.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'رقم الهاتف' : 'Phone'}</label>
                        <input
                          type="text"
                          value={brandingForm.phone}
                          onChange={(e) => setBrandingForm({ ...brandingForm, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'رقم الواتساب' : 'WhatsApp'}</label>
                        <input
                          type="text"
                          value={brandingForm.whatsapp}
                          onChange={(e) => setBrandingForm({ ...brandingForm, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visual Theme, Logo, & Security Passkey */}
                  <div className="space-y-6">
                    {/* Visual Media & Colors */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                      <h5 className="text-xs font-black text-sky-400 uppercase">{isArabic ? 'اللوجو والألوان' : 'Logo & Colors'}</h5>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'اللون الرئيسي' : 'Primary Color'}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={brandingForm.primaryColor}
                              onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                            />
                            <span className="text-xs font-mono text-slate-300">{brandingForm.primaryColor}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'اللون الثانوي' : 'Secondary Color'}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={brandingForm.secondaryColor}
                              onChange={(e) => setBrandingForm({ ...brandingForm, secondaryColor: e.target.value })}
                              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                            />
                            <span className="text-xs font-mono text-slate-300">{brandingForm.secondaryColor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Logo upload */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">{isArabic ? 'رابط اللوجو أو رفع صورة' : 'Logo URL'}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={brandingForm.logoUrl}
                            onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                          />
                          <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl cursor-pointer text-xs font-bold shrink-0 flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isArabic ? 'رفع' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (dataUrl) =>
                                  setBrandingForm({ ...brandingForm, logoUrl: dataUrl })
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Change Admin PIN & Email Validation */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <h5 className="text-xs font-black text-amber-400 uppercase flex items-center gap-1.5">
                        <Key className="w-4 h-4" />
                        <span>{isArabic ? 'تغيير كلمة مرور الإدارة (Admin PIN)' : 'Change Admin Passkey'}</span>
                      </h5>

                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder={isArabic ? 'كلمة المرور الحالية' : 'Current Passkey'}
                          value={passkeyForm.oldKey}
                          onChange={(e) => setPasskeyForm({ ...passkeyForm, oldKey: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        />
                        <input
                          type="password"
                          placeholder={isArabic ? 'كلمة المرور الجديدة' : 'New Passkey'}
                          value={passkeyForm.newKey}
                          onChange={(e) => setPasskeyForm({ ...passkeyForm, newKey: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                        />
                        <input
                          type="email"
                          placeholder={isArabic ? `تأكيد البريد الإلكتروني (${ownerSettings.adminEmail})` : `Confirm Owner Email (${ownerSettings.adminEmail})`}
                          value={passkeyForm.confirmEmail}
                          onChange={(e) => setPasskeyForm({ ...passkeyForm, confirmEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                        />

                        {passkeyFeedback && (
                          <p className={`text-xs font-bold ${passkeyFeedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
                            {passkeyFeedback.message}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const res = updateAdminPasskey(passkeyForm.oldKey, passkeyForm.newKey, passkeyForm.confirmEmail);
                            setPasskeyFeedback(res);
                            if (res.success) {
                              setPasskeyForm({ oldKey: '', newKey: '', confirmEmail: '' });
                            }
                          }}
                          className="w-full py-2 bg-amber-600 hover:bg-amber-500 font-bold text-xs text-slate-950 rounded-xl transition"
                        >
                          {isArabic ? 'تحديث كلمة المرور' : 'Update Passkey'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save All Branding */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      updateOwnerSettings(brandingForm);
                      setBrandingSavedNotice(true);
                      setTimeout(() => setBrandingSavedNotice(false), 3000);
                    }}
                    className="flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isArabic ? 'حفظ كافة إعدادات الهوية' : 'Save Branding Changes'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: PUBLIC SERVICES MANAGER (6) */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <h4 className="text-lg font-black text-white">
                  {isArabic ? 'إدارة كروت الخدمات العامة الستة (6)' : 'Public Service Cards Manager'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicServices.map((service) => (
                    <div key={service.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updatePublicService({ ...service, title: e.target.value })}
                          className="font-bold text-white text-sm bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 flex-1 me-2"
                        />
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={service.active}
                            onChange={(e) => updatePublicService({ ...service, active: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-sky-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                      </div>

                      <textarea
                        rows={2}
                        value={service.shortDesc}
                        onChange={(e) => updatePublicService({ ...service, shortDesc: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                        placeholder="Short description"
                      />

                      <textarea
                        rows={3}
                        value={service.fullDesc}
                        onChange={(e) => updatePublicService({ ...service, fullDesc: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-400"
                        placeholder="Full technical disclosure"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={service.priceEstimate || ''}
                          placeholder={isArabic ? 'السعر التقديري' : 'Price estimate'}
                          onChange={(e) => updatePublicService({ ...service, priceEstimate: e.target.value })}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-amber-300"
                        />
                        <input
                          type="text"
                          value={service.warranty || ''}
                          placeholder={isArabic ? 'الضمان' : 'Warranty'}
                          onChange={(e) => updatePublicService({ ...service, warranty: e.target.value })}
                          className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-emerald-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: OFFERS SLIDER MANAGER */}
            {activeTab === 'offers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white">
                      {isArabic ? 'إدارة عروض السلايدر الترويجية' : 'Promotional Offers Slider Manager'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isArabic ? 'يتم عرض حتى ٣ عروض نشطة متتالية كل ١٠ ثوانٍ' : 'Displays up to 3 active deals looping every 10s'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newOffer: OfferItem = {
                        id: 'offer-' + Date.now(),
                        title: 'عرض ترويجي جديد',
                        titleEn: 'New Promo Deal',
                        subtitle: 'تفاصيل العرض الحصري ونسبة الخصم',
                        subtitleEn: 'Exclusive discount details',
                        badge: 'خصم خاص',
                        discountPercent: 20,
                        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
                        active: true,
                      };
                      saveOffer(newOffer);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-xs sm:text-sm rounded-xl text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isArabic ? 'إضافة عرض جديد' : 'Add New Offer'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {offers.map((offer, index) => (
                    <div key={offer.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-1 flex flex-col items-center justify-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            if (index > 0) {
                              const newOffers = [...offers];
                              const temp = newOffers[index - 1];
                              newOffers[index - 1] = newOffers[index];
                              newOffers[index] = temp;
                              reorderOffers(newOffers);
                            }
                          }}
                          className="p-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-300"
                          title={isArabic ? 'تقديم العرض للأمام' : 'Move Up'}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs text-slate-500 font-bold">#{index + 1}</span>
                        <button
                          type="button"
                          disabled={index === offers.length - 1}
                          onClick={() => {
                            if (index < offers.length - 1) {
                              const newOffers = [...offers];
                              const temp = newOffers[index + 1];
                              newOffers[index + 1] = newOffers[index];
                              newOffers[index] = temp;
                              reorderOffers(newOffers);
                            }
                          }}
                          className="p-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-300"
                          title={isArabic ? 'تأخير العرض للخلف' : 'Move Down'}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <img
                        src={offer.imageUrl}
                        alt={offer.title}
                        className="sm:col-span-3 w-full h-28 object-cover rounded-xl border border-slate-700"
                      />
                      <div className="sm:col-span-6 space-y-2">
                        <input
                          type="text"
                          value={offer.title}
                          onChange={(e) => saveOffer({ ...offer, title: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm font-bold text-white"
                        />
                        <input
                          type="text"
                          value={offer.subtitle}
                          onChange={(e) => saveOffer({ ...offer, subtitle: e.target.value })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                        />
                        <div className="flex gap-2 text-xs">
                          <input
                            type="text"
                            value={offer.badge}
                            onChange={(e) => saveOffer({ ...offer, badge: e.target.value })}
                            className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold"
                          />
                          <input
                            type="date"
                            value={offer.expiryDate}
                            onChange={(e) => saveOffer({ ...offer, expiryDate: e.target.value })}
                            className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300 font-mono"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex flex-col items-end gap-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <span>{offer.active ? '🟢 نشط' : '⚪️ معطل'}</span>
                          <input
                            type="checkbox"
                            checked={offer.active}
                            onChange={(e) => saveOffer({ ...offer, active: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-700 rounded-full peer peer-checked:bg-sky-600 after:content-[''] after:absolute after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                        </label>
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: MONETIZATION ADS MANAGER */}
            {activeTab === 'ads' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white">
                      {isArabic ? 'إدارة بنرات الإعلانات والرعاة (Monetization)' : 'Monetization Ads Manager'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isArabic ? 'بنر عريض مثبت أسفل الشاشة مع مؤقت دوران بالثواني' : 'Sticky edge-to-edge footer ad rotation'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newAd: MonetizationAd = {
                        id: 'ad-' + Date.now(),
                        sponsorName: 'راعي جديد لقطع الغيار',
                        title: 'عرض خاص على قطع الغيار',
                        subtitle: 'خصومات حصرية لعملاء الورشة',
                        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
                        targetUrl: 'https://wa.me/201001234567',
                        durationSeconds: 8,
                        active: true,
                        clicks: 0,
                      };
                      saveAd(newAd);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-xs sm:text-sm rounded-xl text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isArabic ? 'إضافة إعلان راعي' : 'Add Sponsor Ad'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {ads.map((ad) => (
                    <div key={ad.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="text"
                            value={ad.sponsorName}
                            onChange={(e) => saveAd({ ...ad, sponsorName: e.target.value })}
                            className="font-bold text-sm text-amber-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700"
                            placeholder="Sponsor Name"
                          />
                          <span className="text-xs font-mono text-slate-400">
                            👁 {ad.clicks || 0} {isArabic ? 'نقرة' : 'Clicks'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <Clock className="w-4 h-4 text-sky-400" />
                            <input
                              type="number"
                              value={ad.durationSeconds}
                              onChange={(e) => saveAd({ ...ad, durationSeconds: parseInt(e.target.value) || 5 })}
                              className="w-14 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center font-mono text-white"
                            />
                            <span>{isArabic ? 'ثواني' : 'sec'}</span>
                          </div>

                          <button onClick={() => deleteAd(ad.id)} className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={ad.title}
                          onChange={(e) => saveAd({ ...ad, title: e.target.value })}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          placeholder="Ad headline"
                        />
                        <input
                          type="text"
                          value={ad.targetUrl}
                          onChange={(e) => saveAd({ ...ad, targetUrl: e.target.value })}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-sky-300 font-mono"
                          placeholder="Target WhatsApp / Website Link"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: CUSTOM PAGES & POLICIES BUILDER */}
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-white">
                    {isArabic ? 'منشئ الصفحات والسياسات القانونية' : 'Custom Pages & Legal Builder'}
                  </h4>
                  <button
                    onClick={() => {
                      const newPage: CustomPage = {
                        id: 'page-' + Date.now(),
                        slug: 'custom-' + Date.now(),
                        title: 'صفحة جديدة',
                        titleEn: 'New Page',
                        content: 'اكتب محتوى الصفحة هنا...',
                        contentEn: 'Enter page content here...',
                        isSystem: false,
                        showInFooter: true,
                        updatedAt: new Date().toISOString().split('T')[0],
                      };
                      saveCustomPage(newPage);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-xs sm:text-sm rounded-xl text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isArabic ? 'إضافة صفحة مخصصة' : 'Add Custom Page'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {customPages.map((page) => (
                    <div key={page.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={page.title}
                          onChange={(e) => saveCustomPage({ ...page, title: e.target.value })}
                          className="font-bold text-sm text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 flex-1 me-3"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-400 flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={page.showInFooter}
                              onChange={(e) => saveCustomPage({ ...page, showInFooter: e.target.checked })}
                            />
                            <span>{isArabic ? 'إظهار في الفوتر' : 'Show in Footer'}</span>
                          </label>
                          {!page.isSystem && (
                            <button
                              onClick={() => deleteCustomPage(page.id)}
                              className="p-1.5 text-red-400 hover:bg-red-950/60 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        rows={4}
                        value={page.content}
                        onChange={(e) => saveCustomPage({ ...page, content: e.target.value, updatedAt: new Date().toISOString().split('T')[0] })}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 leading-relaxed font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Lightbox for Car Photos */}
      {lightboxImages && lightboxImages.length > 0 && (
        <ImageLightboxModal
          images={lightboxImages}
          initialIndex={lightboxInitialIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}

      {/* Commercial Invoice Full Modal with dynamic QR Code & Print */}
      {viewingCommercialInvoice && (
        <CommercialInvoiceModal
          invoice={viewingCommercialInvoice}
          onClose={() => setViewingCommercialInvoice(null)}
        />
      )}
    </div>
  );
};
