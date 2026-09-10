import React from 'react';
import { X, FileText, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PolicyModal: React.FC = () => {
  const { selectedCustomPage, setSelectedCustomPage, language } = useApp();
  const isArabic = language === 'ar';

  if (!selectedCustomPage) return null;

  const page = selectedCustomPage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto">
        <button
          onClick={() => setSelectedCustomPage(null)}
          className="absolute top-4 start-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 text-sky-400">
          <FileText className="w-7 h-7" />
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isArabic ? page.title : page.titleEn}
            </h3>
            {page.updatedAt && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{isArabic ? `تاريخ السريان: ${page.updatedAt}` : `Effective: ${page.updatedAt}`}</span>
              </p>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {isArabic ? page.content : (page.contentEn || page.content)}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setSelectedCustomPage(null)}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold text-sm text-slate-200 rounded-xl transition"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
