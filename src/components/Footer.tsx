import React, { useState, useRef } from 'react';
import { Shield, Code, Heart, Wrench, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { developerConfig } from '../developer.config';

export const Footer: React.FC = () => {
  const {
    ownerSettings,
    customPages,
    setSelectedCustomPage,
    setIsDeveloperModalOpen,
    setIsAdminAuthModalOpen,
    language,
  } = useApp();
  const isArabic = language === 'ar';

  // Secret 5-tap tracker
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyrightTap = () => {
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount === 5) {
      setTapCount(0);
      setIsAdminAuthModalOpen(true);
      return;
    }

    // Reset tap count if no tap within 2.5 seconds
    tapTimerRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2500);
  };

  const footerPages = customPages.filter((p) => p.showInFooter);

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-850 pt-10 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-850">
          {/* Workshop Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="text-base font-extrabold text-white">
                {isArabic ? ownerSettings.workshopName : ownerSettings.workshopNameEn}
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isArabic ? ownerSettings.slogan : ownerSettings.sloganEn}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              📍 {isArabic ? ownerSettings.address : ownerSettings.addressEn}
            </p>
          </div>

          {/* Legal & Policy Pages */}
          <div className="md:text-end">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-3">
              {isArabic ? 'السياسات والضمان وحماية البيانات' : 'Policies, Warranty & Privacy'}
            </h4>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs md:justify-end">
              {footerPages.map((page) => (
                <li key={page.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomPage(page)}
                    className="hover:text-sky-400 transition underline-offset-2 hover:underline cursor-pointer"
                  >
                    {isArabic ? page.title : page.titleEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Developer trigger and 5-tap Admin secret trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Developer Portfolio Trigger (1 click) */}
          <div className="flex items-center gap-2">
            <span>{isArabic ? 'تصميم وهندسة البرمجيات بواسطة:' : 'Engineered & Designed by:'}</span>
            <button
              id="developer-portfolio-btn"
              type="button"
              onClick={() => setIsDeveloperModalOpen(true)}
              className="group inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-sky-500/40 transition shadow-sm cursor-pointer"
              title={isArabic ? 'عرض ملف المطور وسابقة الأعمال' : 'View Developer Profile'}
            >
              <Code className="w-3.5 h-3.5 text-sky-400" />
              <span className="group-hover:underline">{developerConfig.name}</span>
            </button>
          </div>

          {/* Secret 5-Tap Copyright Line */}
          <div
            id="secret-admin-trigger-copyright"
            onClick={handleCopyrightTap}
            className="cursor-pointer select-none text-slate-400 hover:text-slate-300 transition text-center sm:text-end py-1.5 px-3 rounded-lg hover:bg-slate-900/60 active:bg-slate-900 border border-transparent hover:border-slate-800"
            title="AutoMaster Pro — All Rights Reserved"
          >
            <span>
              © {developerConfig.copyrightYear} {isArabic ? ownerSettings.workshopName : ownerSettings.workshopNameEn}.{' '}
              {isArabic ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}
            </span>
            {tapCount > 0 && tapCount < 5 && (
              <span className="ms-2 text-[10px] text-amber-400 font-mono">
                ({5 - tapCount})
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
