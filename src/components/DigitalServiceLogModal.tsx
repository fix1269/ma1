import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import {
  X,
  Car,
  Calendar,
  Gauge,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Share2,
  Download,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Copy,
  Printer,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer, ServiceItem, ServiceCategory } from '../types';
import { generateCustomerWhatsAppReminder, openWhatsAppChat } from '../utils/whatsapp';
import { ImageLightboxModal } from './ImageLightboxModal';

export const DigitalServiceLogModal: React.FC = () => {
  const {
    selectedCustomerForLog,
    setSelectedCustomerForLog,
    ownerSettings,
    categories,
    language,
  } = useApp();
  const isArabic = language === 'ar';

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    fluids: true,
    filters: true,
    ignition_mechanical: true,
    brakes_suspension: true,
    electrical_ac: true,
    body_doko: true,
  });

  const [isExportingImage, setIsExportingImage] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  const invoiceReportRef = useRef<HTMLDivElement>(null);

  if (!selectedCustomerForLog) return null;

  const customer = selectedCustomerForLog;

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const getStatusBadge = (status: ServiceItem['status']) => {
    switch (status) {
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isArabic ? 'ممتاز / سليم' : 'Good'}</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isArabic ? 'يحتاج متابعة' : 'Attention'}</span>
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/80 text-red-300 border border-red-700/60 animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span>{isArabic ? 'عاجل ومستحق' : 'Critical / Due'}</span>
          </span>
        );
    }
  };

  // WhatsApp Reminder Sender
  const handleSendWhatsApp = () => {
    const dueServices = customer.services.filter((s) => s.status === 'critical' || s.status === 'medium');
    const itemsToSend = dueServices.length > 0 ? dueServices : customer.services;
    const message = generateCustomerWhatsAppReminder(customer, ownerSettings, itemsToSend);
    openWhatsAppChat(customer.phone, message);
  };

  // High-Resolution Edge-to-Edge Image Exporter (Supports modern CSS / OKLCH / Tailwind)
  const handleExportAsImage = async () => {
    if (!invoiceReportRef.current) return;
    setIsExportingImage(true);

    try {
      const imgData = await toPng(invoiceReportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0f172a',
      });

      const link = document.createElement('a');
      link.href = imgData;
      link.download = `ServiceLog_${customer.plateNumber.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Error generating image via html-to-image:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 my-6 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isArabic ? 'السجل الرقمي المعتمد للصيانة' : 'Certified Digital Service Log'}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic ? `العميل: ${customer.fullName}` : `Client: ${customer.fullName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Share Button */}
            <button
              id="log-send-whatsapp-btn"
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md"
              title={isArabic ? 'إرسال تقرير الصيانة عبر واتساب' : 'Send via WhatsApp'}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isArabic ? 'إرسال واتساب' : 'WhatsApp'}</span>
            </button>

            {/* Export as Image Button */}
            <button
              id="log-export-img-btn"
              onClick={handleExportAsImage}
              disabled={isExportingImage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50"
              title={isArabic ? 'تحميل السجل كصورة عالية الجودة' : 'Download as Image'}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isExportingImage ? '...' : (isArabic ? 'صورة الفاتورة' : 'Save Image')}</span>
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              title={isArabic ? 'طباعة' : 'Print'}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => setSelectedCustomerForLog(null)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body / Printable Invoice Canvas */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900" ref={invoiceReportRef}>
          {/* Header Card with Vehicle Spec & Plate */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {customer.carPhotoUrl ? (
                <img
                  src={customer.carPhotoUrl}
                  alt={customer.carModel}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-700 shrink-0 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Car className="w-10 h-10" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-sky-950 border-2 border-sky-500 text-sky-300 font-black text-sm rounded-lg tracking-wider">
                    {customer.plateNumber}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 text-xs font-mono rounded">
                    VIN: {customer.vin || 'N/A'}
                  </span>
                </div>
                <h4 className="text-xl font-black text-white">{customer.carModel}</h4>
                <p className="text-xs text-slate-300">
                  {isArabic ? `المالك: ${customer.fullName}` : `Owner: ${customer.fullName}`} • {customer.phone}
                </p>
                {customer.notes && (
                  <p className="text-xs text-amber-300/90 font-medium pt-1">
                    ℹ️ {customer.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Odometer & Quick Stats */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800 shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 text-sky-400 font-mono">
                <Gauge className="w-5 h-5" />
                <span className="text-lg font-black text-white">{customer.odometer.toLocaleString()}</span>
                <span className="text-xs text-slate-400">KM</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isArabic ? 'آخر تحديث للسجل:' : 'Last Updated:'}{' '}
                <span className="text-slate-200 font-semibold">
                  {new Date(customer.updatedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-angle car inspection photo gallery */}
          {((customer.carPhotos && customer.carPhotos.length > 0) || customer.carPhotoUrl) && (
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isArabic ? 'معرض صور وتوثيق حالة السيارة قبل وبعد الصيانة' : 'Multi-Angle Vehicle Inspection Gallery'}</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {isArabic ? 'اضغط لتكبير الصورة بدقة عالية' : 'Click to zoom'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {([customer.carPhotoUrl, ...(customer.carPhotos || [])].filter((p): p is string => Boolean(p))).filter((v, i, a) => a.indexOf(v) === i).map((img, idx, arr) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLightboxImages(arr);
                      setLightboxInitialIndex(idx);
                    }}
                    className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <img src={img} alt={`Vehicle view ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Accordion Maintenance Groups */}
          <div className="space-y-4">
            <h5 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>{isArabic ? 'جداول وبنود الصيانة الدورية المفصلة' : 'Detailed Maintenance Categories'}</span>
            </h5>

            {categories.map((category) => {
              const catServices = customer.services.filter((s) => s.category === category.id);
              const isExpanded = expandedCategories[category.id] !== false;

              return (
                <div
                  key={category.id}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800/90 overflow-hidden shadow-md"
                >
                  {/* Category Accordion Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-5 py-3.5 bg-slate-900/90 hover:bg-slate-850 flex items-center justify-between gap-3 text-start transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white">
                        {isArabic ? category.name : category.nameEn}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {catServices.length}
                      </span>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Category Items List */}
                  {isExpanded && (
                    <div className="p-4 divide-y divide-slate-800/60">
                      {catServices.length > 0 ? (
                        catServices.map((service) => (
                          <div
                            key={service.id}
                            className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-bold text-slate-100">
                                  {isArabic ? service.name : (service.nameEn || service.name)}
                                </span>
                                {getStatusBadge(service.status)}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                                {service.serviceDate && (
                                  <span>
                                    📅 {isArabic ? 'تاريخ التنفيذ:' : 'Serviced:'} {service.serviceDate}
                                  </span>
                                )}
                                {service.nextDueDate && (
                                  <span className={service.status === 'critical' ? 'text-red-400 font-bold' : ''}>
                                    ⏳ {isArabic ? 'الموعد القادم:' : 'Next Due:'} {service.nextDueDate}
                                  </span>
                                )}
                                {service.nextOdometer && (
                                  <span>
                                    🛣 {isArabic ? 'العداد المستهدف:' : 'Due at KM:'} {service.nextOdometer.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              {service.notes && (
                                <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 mt-1">
                                  {service.notes}
                                </p>
                              )}
                            </div>

                            {/* Service Photo / Cost */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                              {service.cost && service.cost > 0 && (
                                <span className="text-xs font-bold text-amber-400 font-mono">
                                  {service.cost.toLocaleString()} EGP
                                </span>
                              )}
                              {service.photoUrl && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (service.photoUrl) {
                                      setLightboxImages([service.photoUrl]);
                                      setLightboxInitialIndex(0);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline cursor-pointer"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>{isArabic ? 'عرض الصورة' : 'Photo'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic py-2">
                          {isArabic ? 'لا توجد بنود مسجلة في هذا القسم بعد.' : 'No maintenance records in this category.'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Workshop stamp at footer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              <p className="font-bold text-slate-300">{ownerSettings.workshopName}</p>
              <p className="text-[11px] text-slate-500">{ownerSettings.address}</p>
            </div>
            <div className="text-center sm:text-end">
              <p className="font-mono text-emerald-400">✓ Certified Digital Seal</p>
              <p className="text-[11px] text-slate-500">{ownerSettings.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for Fullscreen Image Viewing */}
      {lightboxImages && lightboxImages.length > 0 && (
        <ImageLightboxModal
          images={lightboxImages}
          initialIndex={lightboxInitialIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}
    </div>
  );
};
