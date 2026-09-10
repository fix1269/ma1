import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminGatewayModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    setIsAdminDashboardOpen,
    verifyAdminPasskey,
    language,
  } = useApp();
  const isArabic = language === 'ar';

  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAdminAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPasskey(passkey)) {
      setErrorMsg(null);
      setPasskey('');
      setIsAdminAuthModalOpen(false);
      setIsAdminDashboardOpen(true);
    } else {
      setErrorMsg(
        isArabic
          ? 'رمز المرور غير صحيح! (الرمز الافتراضي: 123)'
          : 'Incorrect passkey! (Default key is: 123)'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdminAuthModalOpen(false);
            setErrorMsg(null);
            setPasskey('');
          }}
          className="absolute top-4 start-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4 shadow-lg shadow-sky-950/50">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-white">
            {isArabic ? 'بوابة إدارة الورشة السرية' : 'Secret Admin Gateway'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isArabic
              ? 'أدخل رمز المرور المعتمد لفتح لوحة تحكم العملاء والسجلات'
              : 'Enter passkey to unlock the management dashboard'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isArabic ? 'رمز الدخول (Passkey):' : 'Admin Passkey:'}
            </label>
            <div className="relative">
              <input
                id="admin-passkey-input"
                type="password"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setErrorMsg(null);
                }}
                autoFocus
                placeholder="•••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-center text-xl tracking-widest text-white outline-none transition"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute end-3 top-3.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 text-center">
              {isArabic ? 'الرمز الافتراضي للتجربة: 123' : 'Default demo key: 123'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            id="admin-auth-submit-btn"
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-950/60 border border-sky-400/30 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isArabic ? 'دخول لوحة الإدارة' : 'Access Management'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
