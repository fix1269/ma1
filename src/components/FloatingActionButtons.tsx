import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingActionButtons: React.FC = () => {
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
        ? 'مرحباً، أود الاستفسار عن خدمات وحجز صيانة في مركزكم الكرام'
        : 'Hello, I would like to inquire about your automotive services.'
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${ownerSettings.phone}`;
  };

  return (
    <>
      <div className="fixed end-4 bottom-16 sm:bottom-20 z-40 flex flex-col gap-2.5">
        {/* Google Maps Shortcut */}
        <button
          id="fab-maps-btn"
          onClick={() => setShowMapModal(true)}
          className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-sky-400 hover:text-white hover:bg-sky-600 border border-slate-700/80 shadow-xl shadow-slate-950/60 transition-all transform hover:scale-105 active:scale-95"
          title={isArabic ? 'موقع المركز على خرائط جوجل' : 'Google Maps Location'}
        >
          <MapPin className="w-5 h-5" />
          <span className="absolute end-14 bg-slate-900 text-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isArabic ? 'موقع المركز' : 'Location'}
          </span>
        </button>

        {/* Direct Call Shortcut */}
        <button
          id="fab-call-btn"
          onClick={handleCall}
          className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 hover:text-white hover:bg-amber-600 border border-slate-700/80 shadow-xl shadow-slate-950/60 transition-all transform hover:scale-105 active:scale-95"
          title={isArabic ? 'اتصال هاتفي مباشر' : 'Direct Phone Call'}
        >
          <Phone className="w-5 h-5" />
          <span className="absolute end-14 bg-slate-900 text-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {ownerSettings.phone}
          </span>
        </button>

        {/* Instant WhatsApp Shortcut */}
        <button
          id="fab-whatsapp-btn"
          onClick={handleWhatsApp}
          className="group relative flex items-center justify-center w-13 h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-2xl shadow-emerald-950/70 transition-all transform hover:scale-105 active:scale-95 animate-bounce"
          style={{ animationDuration: '3s' }}
          title={isArabic ? 'محادثة واتساب فورية' : 'Instant WhatsApp Chat'}
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute end-15 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isArabic ? 'واتساب مباشر' : 'WhatsApp'}
          </span>
        </button>
      </div>

      {/* Google Maps Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 start-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-sky-400">
              <MapPin className="w-7 h-7" />
              <div>
                <h3 className="text-lg font-black text-white">
                  {isArabic ? 'موقع ورشة الصيانة' : 'Workshop Location'}
                </h3>
                <p className="text-xs text-slate-400">{ownerSettings.workshopName}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 mb-5 text-sm">
              <p className="text-slate-300 font-medium">
                📍 {isArabic ? ownerSettings.address : ownerSettings.addressEn}
              </p>
              <p className="text-xs text-slate-400">
                ⏰ {isArabic ? 'مواعيد العمل: يومياً من ٩:٠٠ صباحاً حتى ١٠:٠٠ مساءً (الجمعة من ١:٠٠ ظهراً)' : 'Hours: Daily 9:00 AM - 10:00 PM (Friday from 1:00 PM)'}
              </p>
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
    </>
  );
};
