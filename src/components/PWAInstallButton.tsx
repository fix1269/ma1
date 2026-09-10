import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Monitor } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  isArabic: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ isArabic }) => {
  const { isInstalled, isIOS, hasNativePrompt, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already running in standalone PWA mode, hide the install button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowGuideModal(true);
      return;
    }

    if (hasNativePrompt) {
      const outcome = await install();
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 3500);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        id="pwa-install-header-btn"
        type="button"
        onClick={handleInstallClick}
        className="relative group flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3.5 md:py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:scale-95 rounded-xl shadow-md shadow-sky-950/40 border border-sky-400/30 transition-all duration-200 cursor-pointer"
        title={isArabic ? 'تثبيت التطبيق على جهازك (PWA)' : 'Install App on your device (PWA)'}
        aria-label={isArabic ? 'تثبيت التطبيق' : 'Install App'}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <Download className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:-translate-y-0.5" />
        <span className="whitespace-nowrap font-bold">
          {isArabic ? 'تثبيت التطبيق' : 'Install App'}
        </span>
      </button>

      {/* Installation Guide Modal (iOS & Desktop Fallback) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100">
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 start-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-sky-400">
              {isIOS ? <Smartphone className="w-7 h-7" /> : <Monitor className="w-7 h-7" />}
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isArabic ? 'تثبيت التطبيق السريع (PWA)' : 'Install Web App (PWA)'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isArabic ? 'يعمل بدون إنترنت كبرنامج أصلي' : 'Runs natively offline'}
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <p>
                    {isArabic
                      ? 'اضغط على زر المشاركة (Share) في أسفل شاشة متصفح Safari.'
                      : 'Tap the Share icon in the bottom Safari toolbar.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <p>
                    {isArabic
                      ? 'مرر للأسفل واضغط على "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                  <p>
                    {isArabic
                      ? 'اضغط على "إضافة" (Add) أعلى الشاشة وسيعمل التطبيق كبرنامج أصلي مستقل!'
                      : 'Tap "Add" in the top corner. Enjoy full native app experience!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <p>
                    {isArabic
                      ? 'انقر على أيقونة التثبيت ⊕ في شريط عنوان المتصفح (URL Bar).'
                      : 'Click the install icon ⊕ in your browser address bar.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <p>
                    {isArabic
                      ? 'أو افتح قائمة المتصفح (⋮) ثم اختر "تثبيت AutoMaster Pro".'
                      : 'Or open menu (⋮) and select "Install AutoMaster Pro".'}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 w-full py-3 bg-sky-600 hover:bg-sky-500 font-bold text-white rounded-2xl transition shadow-lg shadow-sky-950/50 cursor-pointer"
            >
              {isArabic ? 'حسناً، فهمت' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {installedSuccess && (
        <div className="fixed top-5 end-5 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-100" />
          <span>{isArabic ? 'تم تثبيت التطبيق بنجاح!' : 'App installed successfully!'}</span>
        </div>
      )}
    </>
  );
};

