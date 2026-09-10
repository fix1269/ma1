import React, { useState, useEffect } from 'react';
import { Megaphone, ExternalLink, X, Timer, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MonetizationAdBanner: React.FC = () => {
  const { ads, recordAdClick, language } = useApp();
  const isArabic = language === 'ar';

  const activeAds = ads.filter((a) => a.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [isDismissed, setIsDismissed] = useState(false);

  const currentAd = activeAds[currentIndex];

  useEffect(() => {
    if (!currentAd) return;
    setSecondsRemaining(currentAd.durationSeconds || 10);
  }, [currentIndex, currentAd]);

  useEffect(() => {
    if (activeAds.length === 0 || isDismissed) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setCurrentIndex((idx) => (idx + 1) % activeAds.length);
          return activeAds[(currentIndex + 1) % activeAds.length]?.durationSeconds || 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAds, currentIndex, isDismissed]);

  if (activeAds.length === 0 || isDismissed || !currentAd) {
    return null;
  }

  const handleAdClick = () => {
    recordAdClick(currentAd.id);
    if (currentAd.targetUrl) {
      window.open(currentAd.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Height class mapping based on ad settings
  const heightStyle =
    currentAd.bannerHeight === 'compact'
      ? 'min-h-[85px]'
      : currentAd.bannerHeight === 'large'
      ? 'min-h-[160px]'
      : 'min-h-[110px]';

  return (
    <section id="monetization-inline-ad-section" className="w-full my-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 shadow-xl border border-amber-300/40 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 ${heightStyle}`}
      >
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none mix-blend-overlay" />

        {/* Left: Sponsor Thumbnail & Info */}
        <div
          onClick={handleAdClick}
          className="relative z-10 flex-1 flex items-center gap-4 cursor-pointer group overflow-hidden w-full md:w-auto"
        >
          {/* Banner / Sponsor Image */}
          {currentAd.imageUrl && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-950/20 shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.sponsorName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                <Megaphone className="w-3 h-3" />
                <span>{currentAd.badgeText || (isArabic ? 'إعلان راعي' : 'Sponsored')}</span>
              </span>
              <span className="text-xs font-black text-slate-950 truncate underline-offset-2 group-hover:underline">
                {currentAd.sponsorName}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-slate-950 leading-snug line-clamp-1 group-hover:text-slate-900">
              {currentAd.title}
            </h4>
            <p className="text-xs font-semibold text-slate-900/90 line-clamp-1 mt-0.5">
              {currentAd.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Controls, Timer & Call to Action */}
        <div className="relative z-10 flex items-center justify-between md:justify-end gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-950/10">
          {/* Timer countdown pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/20 rounded-xl text-xs font-mono font-bold text-slate-950">
            <Timer className="w-3.5 h-3.5" />
            <span>{secondsRemaining}s</span>
          </div>

          {/* Action CTA button */}
          <button
            id="ad-inline-cta-btn"
            type="button"
            onClick={handleAdClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition transform hover:scale-[1.02] active:scale-98 whitespace-nowrap cursor-pointer"
          >
            <span>{isArabic ? 'عرض العرض والطلب' : 'View & Order'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-xl text-slate-950 hover:bg-slate-950/20 transition cursor-pointer"
            aria-label="Dismiss Ad"
            title={isArabic ? 'إخفاء الإعلان' : 'Dismiss Ad'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

