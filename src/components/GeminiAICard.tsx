import React, { useState } from 'react';
import { Sparkles, Bot, ArrowUpRight, MessageSquare, CheckCircle, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GeminiAICard: React.FC = () => {
  const { language } = useApp();
  const isArabic = language === 'ar';

  const [customQuestion, setCustomQuestion] = useState('');
  const [inAppAnswer, setInAppAnswer] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Centralized safe window.open execution as specified: 'width=500,height=700'
  const handleOpenGeminiPopup = (queryPrompt?: string) => {
    const defaultPrompt = isArabic
      ? 'أنا عميل في مركز صيانة سيارات وأحتاج استشارة فنية عن أعطال سيارتي:'
      : 'I am a car workshop client seeking expert automotive diagnostics for:';
    const text = queryPrompt || customQuestion || defaultPrompt;
    
    const encoded = encodeURIComponent(text);
    const geminiUrl = `https://gemini.google.com/app?prompt=${encoded}`;
    
    // Popup window with exact dimensions specified
    window.open(
      geminiUrl,
      '_blank',
      'width=500,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
    );
  };

  // Fast In-app rule-based & AI automotive diagnostic expert
  const handleAskInApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsThinking(true);
    setInAppAnswer(null);

    setTimeout(() => {
      const q = customQuestion.toLowerCase();
      let res = '';

      if (q.includes('فرامل') || q.includes('تيل') || q.includes('brake') || q.includes('صفير')) {
        res = isArabic
          ? '🔍 تشخيص الفرامل: صوت الصفير أو الرعشة عند الضغط يشير إلى تآكل تيل الفرامل بنسبة تفوق 70% أو اعوجاج في الطنابير (الديسكات). ننصح بفحص سُمك التيل وتغيير سائل الفرامل DOT4 فوراً للحفاظ على أمانك.'
          : '🔍 Brake Diagnosis: Squeaking or pedal pulsation indicates worn brake pads (>70%) or warped rotors. We recommend inspecting pad thickness and flushing DOT4 fluid.';
      } else if (q.includes('حرارة') || q.includes('سخونة') || q.includes('ردياتير') || q.includes('heat') || q.includes('temp')) {
        res = isArabic
          ? '🌡 تشخيص دورة التبريد: ارتفاع الحرارة خاصة أثناء التوقف في الزحمة غالباً سببه ضعف مروحة الردياتير، أو نقص في سائل التبريد (مياه الردياتير الحمراء/الخضراء)، أو تلف في الثرموستات (كوعة الحرارة).'
          : '🌡 Cooling System: Overheating in traffic typically stems from cooling fan motor degradation, low coolant levels, or a stuck thermostat.';
      } else if (q.includes('زيت') || q.includes('oil') || q.includes('لزوجة') || q.includes('تغيير')) {
        res = isArabic
          ? '🛢 نصيحة الزيوت: المحركات الحديثة (2015 فما فوق) تتطلب لزوجة تخليقية بالكامل 5W-30 أو 0W-20 للحفاظ على مضخة الزيت والتيربو. يفضل تغيير فلتر الزيت الأصلي مع كل غيار زيت.'
          : '🛢 Oil Advice: Modern engines require fully synthetic 5W-30 or 0W-20 lubricants for optimal VVT and turbo protection. Always replace the OEM filter simultaneously.';
      } else if (q.includes('تكييف') || q.includes('فريون') || q.includes('ac') || q.includes('تبريد')) {
        res = isArabic
          ? '❄️ تشخيص التكييف: ضعف التبريد مع صوت هسيس بالصالون يدل على تسريب بطيء في الفريون أو انسداد فلتر التكييف الكربوني. ننصح بإجراء اختبار كشف التسريب بالنيتروجين وشحن فريون أصلي R134a بالجرام.'
          : '❄️ AC System: Weak cooling with hissing sounds indicates low R134a freon or clogged cabin filter. Nitrogen leak test and digital gram-precise charging recommended.';
      } else {
        res = isArabic
          ? `💡 تشخيص مبدئي: بناءً على استفسارك ("${customQuestion}")، يوصى بفحص السيارة بجهاز OBD-II لقراءة الحساسات والكنترول بدقة. يمكنك أيضاً فتح نافذة Gemini AI المباشرة لتحليل أعمق.`
          : `💡 Diagnostic Overview: Based on your question ("${customQuestion}"), we recommend an OBD-II diagnostic scan. You can also launch Gemini AI directly for in-depth troubleshooting.`;
      }

      setInAppAnswer(res);
      setIsThinking(false);
    }, 600);
  };

  return (
    <section className="w-full py-10 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Gemini Neon Glowing Card Wrapper */}
        <div className="relative rounded-3xl p-0.5 gemini-border-glow shadow-2xl shadow-purple-950/40 overflow-hidden">
          <div className="relative rounded-[23px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 md:p-10">
            {/* Header with official Google Gemini neon animated styling */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-sky-400 animate-spin" style={{ animationDuration: '12s' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black gemini-text-glow">
                      {isArabic ? 'مستشار السيارات الذكي (Gemini AI)' : 'Gemini AI Automotive Diagnostician'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                      Official AI
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    {isArabic
                      ? 'اسأل الذكاء الاصطناعي عن أعطال سيارتك، معاني لمبات الطبلون، ومواعيد الصيانات'
                      : 'Ask Gemini or ChatGPT for instant vehicle fault diagnosis, dashboard lights, and specs'}
                  </p>
                </div>
              </div>

              {/* Centralized window.open launcher button */}
              <button
                id="gemini-open-popup-btn"
                onClick={() => handleOpenGeminiPopup()}
                className="group shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-950/50 border border-indigo-300/30 transition-all transform active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span>{isArabic ? 'فتح نافذة Gemini المنبثقة' : 'Launch Gemini AI Window'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Moving Line effect container */}
            <div className="h-1 w-full rounded-full bg-slate-800 gemini-animated-line mb-6" />

            {/* Quick suggested diagnostic prompts */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
              <span className="text-slate-400 font-medium">
                {isArabic ? 'أسئلة شائعة وسريعة:' : 'Quick Questions:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCustomQuestion(isArabic ? 'ما هو سبب ظهور لمبة Check Engine؟' : 'Why is the Check Engine light on?');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
              >
                {isArabic ? '⚠️ لمبة Check Engine' : 'Check Engine Light'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomQuestion(isArabic ? 'ما أسباب صدور صوت صفير مع الفرامل؟' : 'Causes of brake squeaking noise?');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
              >
                {isArabic ? '🛑 صفير تيل الفرامل' : 'Brake Squeak'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomQuestion(isArabic ? 'متى يجب تغيير زيت الفتيس الأوتوماتيك؟' : 'When to change automatic gearbox fluid?');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
              >
                {isArabic ? '⚙️ موعد زيت الفتيس' : 'Transmission Fluid'}
              </button>
            </div>

            {/* In-app Input Form */}
            <form onSubmit={handleAskInApp} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  id="gemini-question-input"
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder={
                    isArabic
                      ? 'اكتب عطل سيارتك (مثال: ريحة بنزين، هزة مع السرعة، تكييف ضعيف)...'
                      : 'Describe your car issue (e.g. vibration at high speed, AC weak)...'
                  }
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isThinking || !customQuestion.trim()}
                  className="flex-1 sm:flex-none px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {isThinking ? (
                    <Zap className="w-4 h-4 animate-spin text-amber-300" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  <span>{isArabic ? 'تشخيص فوري' : 'Diagnose'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenGeminiPopup(customQuestion)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-bold text-sm rounded-xl border border-slate-700 transition flex items-center justify-center gap-1"
                  title="Ask in Google Gemini Window"
                >
                  <Bot className="w-4 h-4" />
                  <span className="hidden sm:inline">Gemini</span>
                </button>
              </div>
            </form>

            {/* Answer Display */}
            {inAppAnswer && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-slate-100 text-sm leading-relaxed animate-in fade-in duration-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-slate-200">{inAppAnswer}</p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      {isArabic
                        ? 'ملاحظة: هذا التشخيص استرشادي، ويُرجى زيارة مركزنا لإجراء فحص كمبيوتر حي وتأكيد الإصلاح.'
                        : 'Note: AI diagnosis is advisory. Please visit our center for physical scan tool validation.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
