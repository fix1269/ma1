import React from 'react';
import { X, CheckCircle2, ShieldCheck, Clock, Tag, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { openWhatsAppChat } from '../utils/whatsapp';

export const ServiceDetailModal: React.FC = () => {
  const { selectedPublicService, setSelectedPublicService, ownerSettings, language } = useApp();
  const isArabic = language === 'ar';

  if (!selectedPublicService) return null;

  const service = selectedPublicService;

  const handleBookViaWhatsApp = () => {
    const text = isArabic
      ? `مرحباً، أود حجز واستفسار عن خدمة: *${service.title}* في مركزكم الموقر.`
      : `Hello, I would like to book or inquire about: *${service.titleEn || service.title}*.`;
    openWhatsAppChat(ownerSettings.whatsapp, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedPublicService(null)}
          className="absolute top-4 start-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image if available */}
        {service.image && (
          <div className="w-full h-52 rounded-2xl overflow-hidden mb-6 relative border border-slate-700/80 shadow-lg">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {isArabic ? service.title : service.titleEn}
          </h3>
          <p className="text-sm text-sky-400 font-semibold">
            {isArabic ? service.shortDesc : service.shortDescEn}
          </p>
        </div>

        {/* Specs Pill Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {service.priceEstimate && (
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <Tag className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{isArabic ? 'السعر التقديري' : 'Estimate'}</p>
                <p className="text-xs font-bold text-white">{service.priceEstimate}</p>
              </div>
            </div>
          )}

          {service.duration && (
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{isArabic ? 'الوقت المتوقع' : 'Duration'}</p>
                <p className="text-xs font-bold text-white">{service.duration}</p>
              </div>
            </div>
          )}

          {service.warranty && (
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{isArabic ? 'الضمان المعتمد' : 'Warranty'}</p>
                <p className="text-xs font-bold text-white">{service.warranty}</p>
              </div>
            </div>
          )}
        </div>

        {/* Full Comprehensive Description */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-300">
            {isArabic ? 'تفاصيل ومعايير التنفيذ الفني:' : 'Service Overview & Technical Specs:'}
          </h4>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {isArabic ? service.fullDesc : service.fullDescEn}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <button
            id="book-service-whatsapp-btn"
            onClick={handleBookViaWhatsApp}
            className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{isArabic ? 'حجز واستفسار عبر واتساب' : 'Book via WhatsApp'}</span>
          </button>

          <button
            onClick={() => setSelectedPublicService(null)}
            className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
