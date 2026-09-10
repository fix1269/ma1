import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import {
  X,
  Printer,
  Download,
  Share2,
  FileText,
  DollarSign,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Globe,
  Calendar,
  User,
  Car,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';
import { generateQRCodeDataUrl } from '../utils/qrCodeGenerator';

interface CommercialInvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const CommercialInvoiceModal: React.FC<CommercialInvoiceModalProps> = ({
  invoice,
  onClose,
}) => {
  const { ownerSettings, language } = useApp();
  const isArabic = language === 'ar';
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!invoice) return;

    // Generate QR Code with verifiable verification URL
    const targetUrl =
      ownerSettings.websiteUrl && ownerSettings.websiteUrl.trim().length > 0
        ? `${ownerSettings.websiteUrl}?inv=${invoice.invoiceNumber}`
        : `${window.location.origin}${window.location.pathname}?inv=${invoice.invoiceNumber}`;

    generateQRCodeDataUrl(targetUrl, 200).then((url) => {
      setQrCodeUrl(url);
    });
  }, [invoice, ownerSettings.websiteUrl]);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(invoiceRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Commercial_Invoice_${invoice.invoiceNumber}_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Invoice image generation failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 my-6 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Actions Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isArabic ? 'فاتورة صيانة وضريبة تجارية معتمدة' : 'Official Commercial Tax Invoice'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {invoice.invoiceNumber} | {invoice.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isArabic ? 'طباعة الفاتورة' : 'Print'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isExporting ? '...' : isArabic ? 'تحميل صورة' : 'Download Image'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900">
          <div
            ref={invoiceRef}
            id="official-commercial-invoice-document"
            className="w-full bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 print:shadow-none print:border-0 print:p-0 print:m-0 print:w-full"
          >
            {/* Header / Company info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-6">
              <div className="flex items-center gap-4">
                {ownerSettings.logoUrl ? (
                  <img
                    src={ownerSettings.logoUrl}
                    alt={ownerSettings.workshopName}
                    className="w-16 h-16 object-contain rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-2xl">
                    AMP
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                    {isArabic ? ownerSettings.workshopName : ownerSettings.workshopNameEn}
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {ownerSettings.slogan || (isArabic ? 'مركز خدمة وصيانة سيارات معتمد' : 'Certified Automotive Service Center')}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {ownerSettings.phone}
                    </span>
                    {ownerSettings.websiteUrl && (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-sky-700">
                        <Globe className="w-3.5 h-3.5" />
                        {ownerSettings.websiteUrl.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code */}
              <div className="flex flex-col items-center sm:items-end justify-center">
                {qrCodeUrl ? (
                  <div className="p-1.5 bg-white border-2 border-slate-900 rounded-xl shadow-sm text-center">
                    <img src={qrCodeUrl} alt="Invoice QR" className="w-24 h-24 object-contain" />
                    <span className="block text-[9px] font-mono font-bold text-slate-700 mt-1 uppercase">
                      Scan to Verify
                    </span>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Meta details Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block font-semibold">{isArabic ? 'رقم الفاتورة:' : 'Invoice No:'}</span>
                <span className="font-mono font-black text-slate-900 text-sm">{invoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">{isArabic ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                <span className="font-mono font-bold text-slate-900">{invoice.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">{isArabic ? 'اسم العميل:' : 'Customer Name:'}</span>
                <span className="font-bold text-slate-900">{invoice.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold">{isArabic ? 'بيانات السيارة:' : 'Vehicle Data:'}</span>
                <span className="font-bold text-slate-900">
                  {invoice.carModel} ({invoice.plateNumber})
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mt-6">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-300">
                    <th className="py-3 px-3 text-start font-black">{isArabic ? '#' : '#'}</th>
                    <th className="py-3 px-3 text-start font-black">{isArabic ? 'بيان الأعمال / قطع الغيار' : 'Description'}</th>
                    <th className="py-3 px-3 text-center font-black">{isArabic ? 'الكمية' : 'Qty'}</th>
                    <th className="py-3 px-3 text-end font-black">{isArabic ? 'سعر الوحدة' : 'Unit Price'}</th>
                    <th className="py-3 px-3 text-end font-black">{isArabic ? 'الإجمالي' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-3 px-3 font-mono text-center text-slate-700">{item.qty}</td>
                      <td className="py-3 px-3 font-mono text-end text-slate-700">{item.unitPrice.toLocaleString()} EGP</td>
                      <td className="py-3 px-3 font-mono text-end font-bold text-slate-950">{item.total.toLocaleString()} EGP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <div className="mt-6 pt-4 border-t-2 border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="text-xs text-slate-600 max-w-sm space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isArabic ? 'حالة السداد: مدفوع بالكامل' : 'Payment Status: PAID'}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isArabic
                    ? 'هذه فاتورة رسمية صادرة ومعتمدة من النظام السحابي لمركز الخدمة. شكراً لثقتكم باختيارنا.'
                    : 'Official certified tax receipt. Thank you for choosing AutoMaster Pro certified maintenance.'}
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-mono font-bold">{invoice.subtotal.toLocaleString()} EGP</span>
                </div>

                {invoice.discountAmount && invoice.discountAmount > 0 ? (
                  <div className="flex justify-between text-rose-600">
                    <span>{isArabic ? `الخصم (${invoice.discountPercent || 0}%):` : `Discount:`}</span>
                    <span className="font-mono font-bold">-{invoice.discountAmount.toLocaleString()} EGP</span>
                  </div>
                ) : null}

                {invoice.taxAmount && invoice.taxAmount > 0 ? (
                  <div className="flex justify-between text-slate-600">
                    <span>{isArabic ? `ضريبة القيمة المضافة (${invoice.taxPercent || 14}%):` : 'VAT:'}</span>
                    <span className="font-mono font-bold">+{invoice.taxAmount.toLocaleString()} EGP</span>
                  </div>
                ) : null}

                <div className="pt-2 border-t border-slate-900 flex justify-between text-base font-black text-slate-950">
                  <span>{isArabic ? 'الإجمالي النهائي:' : 'Grand Total:'}</span>
                  <span className="font-mono text-lg text-emerald-800">{invoice.total.toLocaleString()} EGP</span>
                </div>
              </div>
            </div>

            {/* Official Stamp & Signature Block */}
            <div className="mt-8 pt-6 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="block font-bold text-slate-900">{isArabic ? 'توقيع المستلم:' : 'Client Signature:'}</span>
                <span className="block mt-6 border-b border-slate-400 w-36"></span>
              </div>

              <div className="text-end">
                <span className="block font-bold text-slate-900">{isArabic ? 'ختم واعتماد المركز:' : 'Official Workshop Seal:'}</span>
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-lg border-2 border-emerald-700 text-emerald-800 font-bold text-[10px] uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authorized Stamp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
