import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Tag, Calendar, ArrowUpRight, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OffersCarousel: React.FC = () => {
  const { offers, language } = useApp();
  const isArabic = language === 'ar';

  // Filter only active offers (max 3 displayed as specified)
  const activeOffers = offers.filter((o) => o.active).slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (activeOffers.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
  }, [activeOffers.length]);

  const prevSlide = useCallback(() => {
    if (activeOffers.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
  }, [activeOffers.length]);

  // 10-second auto-playing loop
  useEffect(() => {
    if (activeOffers.length <= 1 || isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeOffers.length, isPaused, nextSlide, currentIndex]);

  if (activeOffers.length === 0) {
    return null;
  }

  const currentOffer = activeOffers[currentIndex];

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left
        if (isArabic) prevSlide();
        else nextSlide();
      } else {
        // Swiped right
        if (isArabic) nextSlide();
        else prevSlide();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  return (
    <section
      id="offers-carousel-section"
      className="w-full bg-slate-950 py-6 border-b border-slate-800/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-sm md:text-base font-extrabold text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{isArabic ? 'أحدث العروض الحصرية والخصومات' : 'Exclusive Workshop Offers & Deals'}</span>
            </h3>
          </div>

          {/* Navigation Controls */}
          {activeOffers.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                aria-label="Previous Offer"
              >
                {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                aria-label="Next Offer"
              >
                {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Carousel Slide Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 shadow-xl">
          {/* Animated 10s Timer progress bar */}
          {!isPaused && activeOffers.length > 1 && (
            <div
              key={currentIndex}
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-amber-500 origin-left"
              style={{
                animation: 'shimmer 10s linear infinite',
              }}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 sm:p-7 md:p-8">
            {/* Offer Information */}
            <div className="lg:col-span-7 flex flex-col items-start text-start space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-sm">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{currentOffer.badge}</span>
                </span>
                {currentOffer.expiryDate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium border border-slate-700/60">
                    <Calendar className="w-3 h-3 text-sky-400" />
                    <span>{isArabic ? `صالح حتى ${currentOffer.expiryDate}` : `Valid until ${currentOffer.expiryDate}`}</span>
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
                {isArabic ? currentOffer.title : currentOffer.titleEn}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {isArabic ? currentOffer.subtitle : currentOffer.subtitleEn}
              </p>

              {/* CTA link */}
              {currentOffer.ctaLink && (
                <div className="pt-2">
                  <a
                    href={currentOffer.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
                  >
                    <span>{currentOffer.ctaText || (isArabic ? 'احجز هذا العرض الآن' : 'Claim this offer')}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Offer Image */}
            <div className="lg:col-span-5 h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden relative border border-slate-800 shadow-inner">
              <img
                src={currentOffer.imageUrl}
                alt={currentOffer.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              {currentOffer.discountPercent > 0 && (
                <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-lg">
                  -{currentOffer.discountPercent}%
                </div>
              )}
            </div>
          </div>

          {/* Dots Indicator */}
          {activeOffers.length > 1 && (
            <div className="flex items-center justify-center gap-2 pb-4">
              {activeOffers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-sky-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
