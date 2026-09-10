import React from 'react';
import { Search, ShieldCheck, Award, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { ownerSettings, language } = useApp();
  const isArabic = language === 'ar';

  const scrollToLookup = () => {
    const el = document.getElementById('car-lookup-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = document.getElementById('car-search-input');
      if (input) input.focus();
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
      {/* Background Cover Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
        {ownerSettings.bannerUrl && (
          <img
            src={ownerSettings.bannerUrl}
            alt="Workshop Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Decorative Gradient Flares */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 md:w-[600px] h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-sky-400 text-xs font-semibold shadow-lg shadow-sky-950/40 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{isArabic ? 'المنظومة الرقمية المعتمدة لصيانة السيارات' : 'Certified Automotive Digital Service System'}</span>
        </div>

        {/* Workshop Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
          {isArabic ? ownerSettings.workshopName : ownerSettings.workshopNameEn}
        </h2>

        {/* Slogan */}
        <p className="mt-3 text-lg md:text-xl font-bold text-sky-400 max-w-2xl">
          {isArabic ? ownerSettings.slogan : ownerSettings.sloganEn}
        </p>

        {/* Dynamic Multi-line About Us */}
        <p className="mt-4 text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed whitespace-pre-line font-normal">
          {isArabic ? ownerSettings.about : ownerSettings.aboutEn}
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-lookup-cta-btn"
            onClick={scrollToLookup}
            className="group flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm md:text-base rounded-2xl shadow-xl shadow-sky-950/60 border border-sky-300/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="w-5 h-5 text-sky-100 transition-transform group-hover:scale-110" />
            <span>{isArabic ? 'استعلم عن السجل الرقمي لسيارتك' : 'Look Up Your Digital Service Log'}</span>
          </button>
        </div>

        {/* Quick Quality Pillars */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-4xl">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 text-start">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{isArabic ? 'سجل إلكتروني مشفر' : 'Encrypted Digital Log'}</p>
              <p className="text-[10px] text-slate-400">{isArabic ? 'حماية تامة للبيانات' : 'Zero-leakage privacy'}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 text-start">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{isArabic ? 'قطع غيار أصلية' : 'OEM Genuine Parts'}</p>
              <p className="text-[10px] text-slate-400">{isArabic ? 'بضمان المركز المعتمد' : 'Certified warranty'}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 text-start">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{isArabic ? 'تذكير صيانة آلي' : 'Auto Reminders'}</p>
              <p className="text-[10px] text-slate-400">{isArabic ? 'عبر الواتساب مباشرة' : 'WhatsApp alerts'}</p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 text-start">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{isArabic ? 'فحص كمبيوتر دقيق' : 'ECU Diagnostics'}</p>
              <p className="text-[10px] text-slate-400">{isArabic ? 'أحدث أجهزة OBD-II' : 'Factory scan tools'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
