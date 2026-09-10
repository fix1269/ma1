import React, { useState } from 'react';
import { Search, Car, FileText, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CarLookupBox: React.FC = () => {
  const { lookupCar, setSelectedCustomerForLog, language } = useApp();
  const isArabic = language === 'ar';

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const matchedCustomer = lookupCar(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (matchedCustomer) {
      setSelectedCustomerForLog(matchedCustomer);
    }
  };

  const setPreset = (val: string) => {
    setQuery(val);
    setHasSearched(true);
  };

  return (
    <section id="car-lookup-section" className="w-full py-12 md:py-16 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold mb-3">
              <Car className="w-3.5 h-3.5" />
              <span>{isArabic ? 'بوابة العميل الذكية' : 'Smart Client Portal'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {isArabic ? 'استعلام السجل الرقمي لسيارتك' : 'Look Up Your Vehicle Service Log'}
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              {isArabic
                ? 'أدخل رقم اللوحة (مثال: أ ب ج ٤٥٨٩) أو رقم الهاتف المسجل لعرض سجل الصيانات والفواتير ومواعيد الفحص القادمة فوراً.'
                : 'Enter your Plate Number or registered Phone Number to fetch your certified digital maintenance history instantly.'}
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-sky-400" />
              </div>
              <input
                id="car-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!hasSearched && e.target.value.length >= 2) setHasSearched(true);
                }}
                placeholder={isArabic ? 'اكتب رقم اللوحة أو رقم الموبايل أو اسمك...' : 'Enter Plate # or Phone number...'}
                className="w-full ps-11 pe-4 py-4 bg-slate-950/90 border border-slate-700/80 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-2xl text-white placeholder-slate-500 text-base font-medium outline-none transition shadow-inner"
              />
            </div>
            <button
              id="car-search-submit-btn"
              type="submit"
              className="px-7 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-950/60 border border-sky-400/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{isArabic ? 'بحث في السجل' : 'Search Log'}</span>
              <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          </form>

          {/* Quick Demo Pre-fill Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold">{isArabic ? 'أمثلة جاهزة للتجربة:' : 'Quick Demo Examples:'}</span>
            <button
              type="button"
              onClick={() => setPreset('أ ب ج ٤٥٨٩')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg border border-slate-700 transition"
            >
              أ ب ج ٤٥٨٩ (Corolla)
            </button>
            <button
              type="button"
              onClick={() => setPreset('01012345678')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg border border-slate-700 transition"
            >
              01012345678
            </button>
            <button
              type="button"
              onClick={() => setPreset('ق ر ط ٩٦٣٢')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg border border-slate-700 transition"
            >
              ق ر ط ٩٦٣٢ (Tucson)
            </button>
          </div>

          {/* Live Search Match Result Card */}
          {hasSearched && query.trim().length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
              {matchedCustomer ? (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-sky-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {matchedCustomer.carPhotoUrl ? (
                      <img
                        src={matchedCustomer.carPhotoUrl}
                        alt={matchedCustomer.carModel}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700">
                        <Car className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-sky-950 border border-sky-700/60 text-sky-300 font-bold text-xs">
                          {matchedCustomer.plateNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {matchedCustomer.odometer.toLocaleString()} KM
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-1">
                        {matchedCustomer.carModel}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {isArabic ? `المالك: ${matchedCustomer.fullName}` : `Owner: ${matchedCustomer.fullName}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Status Alert Count */}
                    {matchedCustomer.services.some((s) => s.status === 'critical') && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-800/40">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'صيانة عاجلة مستحقة' : 'Urgent Service Due'}</span>
                      </span>
                    )}

                    <button
                      id="view-found-car-log-btn"
                      type="button"
                      onClick={() => setSelectedCustomerForLog(matchedCustomer)}
                      className="w-full md:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{isArabic ? 'فتح السجل الكامل' : 'Open Full Log'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">
                    {isArabic ? 'لم يتم العثور على سيارة مسجلة بهذه البيانات' : 'No registered vehicle found with these credentials'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isArabic
                      ? 'يرجى مراجعة إدارة المركز أو كتابة رقم اللوحة بالشكل الصحيح ليتم تسجيلك في منظومة السجلات الرقمية.'
                      : 'Please check your plate number or contact our front desk to register your vehicle.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
