import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, X, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StaticContactBar: React.FC = () => {
  const { ownerSettings, language } = useApp();
  const isArabic = language === 'ar';
  const [showMapModal, setShowMapModal] = useState(false);

  const handleWhatsApp = () => {
    let cleanPhone = ownerSettings.whatsapp.replace(/[^\d]/g, '');
    if (!cleanPhone.startsWith('20') && cleanPhone.startsWith('01')) {
      cleanPhone = '2' + cleanPhone;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      isArabic
        ? 'مرحباً، أود الاستفسار عن خدمات وحجز موعد صيانة في مركزكم الكرام'
        : 'Hello, I would like to inquire about your automotive services and book an appointment.'
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${ownerSettings.phone}`;
  };

  return (
    <section id="static-contact-section" className="w-full py-6 md:py-8 bg-slate-900/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          {/* Left Info: Quick Contacts */}
          <div className="flex items-center gap-4 text-center sm:text-start flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-white">
                {isArabic ? 'تواصل معنا وحجز موعد الصيانة' : 'Connect & Book Service Appointment'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic ? `مركز ${ownerSettings.workshopName} يرحب بكم يومياً` : `${ownerSettings.workshopNameEn} Welcomes you daily`}
                {' • '}
                <span className="text-slate-300 font-mono">{ownerSettings.phone}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons: WhatsApp, Call, Google Maps */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
            {/* WhatsApp */}
            <button
              id="static-whatsapp-btn"
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition transform hover:scale-[1.02] active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isArabic ? 'واتساب مباشر' : 'WhatsApp'}</span>
            </button>

            {/* Direct Call */}
            <button
              id="static-call-btn"
              onClick={handleCall}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-amber-600 text-amber-300 hover:text-white text-xs sm:text-sm font-bold rounded-2xl border border-slate-700/80 hover:border-amber-500/50 transition transform hover:scale-[1.02] active:scale-98 shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>{ownerSettings.phone}</span>
            </button>

            {/* Google Maps Location */}
            <button
              id="static-maps-btn"
              onClick={() => setShowMapModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-sky-600 text-sky-400 hover:text-white text-xs sm:text-sm font-bold rounded-2xl border border-slate-700/80 hover:border-sky-500/50 transition transform hover:scale-[1.02] active:scale-98 shadow-md"
            >
              <MapPin className="w-4 h-4" />
              <span>{isArabic ? 'موقع المركز' : 'Location Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps Location Dialog */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 start-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-sky-400">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {isArabic ? 'موقع ورشة الصيانة' : 'Workshop Location'}
                </h3>
                <p className="text-xs text-slate-400">{ownerSettings.workshopName}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 mb-5 text-sm">
              <p className="text-slate-200 font-medium">
                📍 {isArabic ? ownerSettings.address : ownerSettings.addressEn}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1 border-t border-slate-900">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isArabic ? 'يومياً من ٩:٠٠ ص حتى ١٠:٠٠ م' : 'Daily 9:00 AM - 10:00 PM'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={ownerSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 font-bold text-white text-center rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-950/50"
              >
                <MapPin className="w-4 h-4" />
                <span>{isArabic ? 'فتح في تطبيق Google Maps' : 'Open in Google Maps'}</span>
              </a>
              <button
                onClick={() => setShowMapModal(false)}
                className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
