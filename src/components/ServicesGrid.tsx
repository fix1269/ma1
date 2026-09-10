import React, { useState } from 'react';
import {
  Sparkles,
  Sofa,
  Palette,
  Wrench,
  Hammer,
  Cpu,
  ArrowUpRight,
  Share2,
  Trash2,
  Check,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PublicService } from '../types';

export const ServicesGrid: React.FC = () => {
  const { publicServices, deletePublicService, setSelectedPublicService, language, ownerSettings } = useApp();
  const isArabic = language === 'ar';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Map icon strings to Lucide components
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-sky-400" />;
      case 'Sofa':
        return <Sofa className="w-5 h-5 text-amber-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-pink-400" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-emerald-400" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-orange-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      default:
        return <Wrench className="w-5 h-5 text-sky-400" />;
    }
  };

  const handleShare = async (e: React.MouseEvent, service: PublicService) => {
    e.stopPropagation();
    const title = isArabic ? service.title : service.titleEn;
    const desc = isArabic ? service.shortDesc : service.shortDescEn;
    const shareText = `${title}\n${desc}\n📍 ${isArabic ? ownerSettings.workshopName : ownerSettings.workshopNameEn}\n📞 ${ownerSettings.phone}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    // Fallback: clipboard copy
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedId(service.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  const handleDelete = (e: React.MouseEvent, serviceId: string) => {
    e.stopPropagation();
    deletePublicService(serviceId);
    setDeleteConfirmId(null);
  };

  const activeServices = publicServices.filter((s) => s.active);

  return (
    <section id="services-grid-section" className="w-full py-12 md:py-16 bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>{isArabic ? 'خدمات الورشة التخصصية' : 'Specialized Workshop Services'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              {isArabic ? 'خدمات احترافية متكاملة لسيارتك' : 'Comprehensive Automotive Care'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            {isArabic
              ? 'نقدم أعلى درجات الدقة والاحترافية بأيدي مهندسين وفنيين معتمدين وأحدث المعدات الأوروبية.'
              : 'Delivering precision diagnostics, factory-grade repairs, and detailing by certified technicians.'}
          </p>
        </div>

        {/* 6 Cards Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              onClick={() => setSelectedPublicService(service)}
              className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-950/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              {/* Card Image preview if available */}
              {service.image ? (
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 relative bg-slate-950 border border-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Icon badge */}
                  <div className="absolute bottom-2 start-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-sm shadow-md">
                    {renderIcon(service.icon)}
                  </div>

                  {/* Top Action controls (Share & Delete) */}
                  <div className="absolute top-2 end-2 flex items-center gap-1.5 z-10">
                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, service)}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-sky-600 text-slate-300 hover:text-white backdrop-blur-sm border border-slate-700/70 transition shadow-md cursor-pointer"
                      title={isArabic ? 'مشاركة تفاصيل الخدمة' : 'Share Service Details'}
                    >
                      {copiedId === service.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(service.id);
                      }}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white backdrop-blur-sm border border-slate-700/70 transition shadow-md cursor-pointer"
                      title={isArabic ? 'حذف هذه الخدمة' : 'Delete Service'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/70 flex items-center justify-center shadow-md">
                    {renderIcon(service.icon)}
                  </div>

                  {/* Top Action controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, service)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white border border-slate-700/70 transition shadow-sm cursor-pointer"
                      title={isArabic ? 'مشاركة' : 'Share'}
                    >
                      {copiedId === service.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(service.id);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700/70 transition shadow-sm cursor-pointer"
                      title={isArabic ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Service Details */}
              <div className="flex-1">
                <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {isArabic ? service.title : service.titleEn}
                </h4>

                <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {isArabic ? service.shortDesc : service.shortDescEn}
                </p>
              </div>

              {/* Card Footer tags */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {service.priceEstimate && (
                  <span className="font-semibold text-amber-400">
                    {service.priceEstimate}
                  </span>
                )}
                
                <span className="flex items-center gap-1 text-sky-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>{isArabic ? 'تفاصيل وحجز' : 'Details & Book'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Delete confirmation dialog overlay */}
              {deleteConfirmId === service.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 bg-slate-950/95 backdrop-blur-md rounded-3xl p-5 flex flex-col items-center justify-center text-center z-30 animate-in fade-in duration-150"
                >
                  <Trash2 className="w-8 h-8 text-rose-500 mb-2" />
                  <p className="text-sm font-bold text-white mb-4">
                    {isArabic ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Confirm deleting this service?'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, service.id)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      {isArabic ? 'نعم، احذف' : 'Yes, Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
                    >
                      {isArabic ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

