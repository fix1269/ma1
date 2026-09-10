import React from 'react';
import { ShieldCheck, Moon, Sun, Globe, Wrench, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const {
    ownerSettings,
    language,
    setLanguage,
    theme,
    setTheme,
    isOnline,
    offlineQueueCount,
    setIsAdminAuthModalOpen,
  } = useApp();

  const isArabic = language === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-3">
        {/* Left: Logo & Workshop Identity */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-gradient-to-tr from-sky-600 to-blue-500 p-0.5 shadow-lg shadow-sky-950/50">
              {ownerSettings.logoUrl ? (
                <img
                  src={ownerSettings.logoUrl}
                  alt={ownerSettings.workshopName}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-[10px]">
                  <Wrench className="w-5 h-5 text-sky-400" />
                </div>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" title="Active & Verified" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-base md:text-xl font-extrabold text-slate-100 tracking-tight leading-tight line-clamp-1">
              {isArabic ? ownerSettings.workshopName : ownerSettings.workshopNameEn}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[11px] md:text-xs text-sky-400 font-medium line-clamp-1">
                {isArabic ? ownerSettings.slogan : ownerSettings.sloganEn}
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-600" />
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40">
                <ShieldCheck className="w-3 h-3" />
                <span>Zero-Server Client Isolated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions (PWA Button, Online Status, Language, Theme) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Offline Sync Buffer Indicator */}
          {!isOnline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold animate-pulse">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isArabic ? `غير متصل (${offlineQueueCount} معلق)` : `Offline (${offlineQueueCount} queued)`}
              </span>
            </div>
          )}

          {isOnline && offlineQueueCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-500/20 text-sky-300 text-xs rounded border border-sky-500/30 font-mono">
              <Wifi className="w-3 h-3 animate-spin" />
              <span>Syncing...</span>
            </div>
          )}

          {/* In-App PWA Install Button */}
          <PWAInstallButton isArabic={isArabic} />

          {/* Language Switcher */}
          <button
            id="lang-toggle-btn"
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-xl transition shadow-sm cursor-pointer"
            title={isArabic ? 'تغيير اللغة إلى الإنجليزية' : 'Switch language to Arabic'}
            aria-label={isArabic ? 'تغيير اللغة' : 'Change Language'}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-300 hover:text-amber-400 bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-xl transition cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
