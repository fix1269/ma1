import React from 'react';
import { X, Mail, MessageCircle, Globe, Github, Linkedin, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { developerConfig } from '../developer.config';

export const DeveloperModal: React.FC = () => {
  const { isDeveloperModalOpen, setIsDeveloperModalOpen, language } = useApp();
  const isArabic = language === 'ar';

  if (!isDeveloperModalOpen) return null;

  const handleWhatsAppDeveloper = () => {
    let cleanPhone = developerConfig.whatsapp.replace(/[^\d]/g, '');
    if (!cleanPhone.startsWith('20') && cleanPhone.startsWith('01')) {
      cleanPhone = '2' + cleanPhone;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
      'مرحباً باشمهندس، أود الاستفسار عن برمجة تطبيق ويب / نظام PWA مماثل لـ AutoMaster Pro'
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEmailDeveloper = () => {
    window.location.href = `mailto:${developerConfig.email}?subject=Inquiry regarding AutoMaster Pro System`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsDeveloperModalOpen(false)}
          className="absolute top-4 start-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2 text-center sm:text-start">
          {/* Avatar with Glow */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-sky-500 via-indigo-500 to-blue-500 shrink-0 shadow-xl shadow-sky-950/60">
            <img
              src={developerConfig.avatarUrl}
              alt={developerConfig.name}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute bottom-2 end-2 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isArabic ? 'مهندس ومطور المنظومة' : 'Lead Software Architect'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{developerConfig.name}</h3>
            <p className="text-xs text-sky-400 font-semibold">{developerConfig.title}</p>
            <p className="text-[11px] text-slate-400 font-mono">{developerConfig.email}</p>
          </div>
        </div>

        {/* Short Bio */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isArabic ? developerConfig.bioAr : developerConfig.bioEn}
        </div>

        {/* Key Competencies / Skills */}
        <div className="mt-4">
          <p className="text-xs font-bold text-slate-400 mb-2">
            {isArabic ? 'التقنيات ومعايير الأمان المعتمدة:' : 'Architectural Pillars & Skills:'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {developerConfig.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Quick Action Contacts */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsAppDeveloper}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-950/40 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{isArabic ? 'محادثة واتساب' : 'WhatsApp'}</span>
          </button>

          <button
            onClick={handleEmailDeveloper}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition active:scale-95"
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>{isArabic ? 'مراسلة إيميل' : 'Send Email'}</span>
          </button>
        </div>

        <p className="mt-4 text-[10px] text-center text-slate-500">
          {isArabic
            ? 'مُدار بالكامل عبر ملف الإعدادات المعزول developer.config.js'
            : 'Configured strictly through developer.config.js'}
        </p>
      </div>
    </div>
  );
};
