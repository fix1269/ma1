import { Customer, OwnerSettings, ServiceItem } from '../types';

/**
 * Format polite Egyptian Arabic WhatsApp message for customer service reminders
 */
export function generateCustomerWhatsAppReminder(
  customer: Customer,
  settings: OwnerSettings,
  dueServices: ServiceItem[]
): string {
  const criticalItems = dueServices.filter((s) => s.status === 'critical');
  const mediumItems = dueServices.filter((s) => s.status === 'medium');
  const upcomingItems = dueServices.filter((s) => s.status === 'good');

  let message = `السلام عليكم ورحمة الله وبركاته، أستاذنا العزيز / *${customer.fullName}* 🚗✨\n`;
  message += `تحية طيبة من *${settings.workshopName}* 🔧\n\n`;
  message += `حرصاً منا على أمان وسلامة سيارتكم الكريمة:\n`;
  message += `🚘 *الموديل:* ${customer.carModel}\n`;
  message += `🔢 *رقم اللوحة:* ${customer.plateNumber}\n`;
  message += `⏱ *العداد الحالي المسجل:* ${customer.odometer.toLocaleString()} كم\n\n`;

  message += `نود تذكيركم بمواعيد الصيانة الدورية المستحقة لسيارتكم:\n`;
  message += `──────────────────────\n`;

  if (criticalItems.length > 0) {
    message += `🔴 *بنود هامة وعاجلة (تتطلب تدخلاً فورياً):*\n`;
    criticalItems.forEach((item, idx) => {
      message += `  ${idx + 1}. *${item.name}*\n`;
      message += `     📅 تاريخ الاستحقاق: ${item.nextDueDate || 'مستحق حالياً'}\n`;
      if (item.nextOdometer) message += `     🛣 عند عداد: ${item.nextOdometer.toLocaleString()} كم\n`;
      if (item.notes) message += `     ⚠️ ملاحظة: ${item.notes}\n`;
    });
    message += `\n`;
  }

  if (mediumItems.length > 0) {
    message += `🟡 *بنود تحتاج فحصاً ومتابعة قريبة:*\n`;
    mediumItems.forEach((item, idx) => {
      message += `  ${idx + 1}. *${item.name}*\n`;
      message += `     📅 موعد الفحص: ${item.nextDueDate}\n`;
      if (item.nextOdometer) message += `     🛣 عند عداد: ${item.nextOdometer.toLocaleString()} كم\n`;
    });
    message += `\n`;
  }

  if (upcomingItems.length > 0 && criticalItems.length === 0 && mediumItems.length === 0) {
    message += `🟢 *بنود الصيانة الدورية المجدولة:*\n`;
    upcomingItems.forEach((item, idx) => {
      message += `  ${idx + 1}. *${item.name}* (موعد: ${item.nextDueDate})\n`;
    });
    message += `\n`;
  }

  message += `──────────────────────\n`;
  message += `📍 *عنوان المركز:* ${settings.address}\n`;
  message += `📞 *للحجز والاستفسار:* ${settings.phone}\n`;
  message += `💬 يسعدنا تشريفكم في أي وقت لخدمتكم وضمان راحة بالكم! 🌟`;

  return message;
}

/**
 * Open WhatsApp directly with phone and encoded message
 */
export function openWhatsAppChat(phone: string, text: string) {
  // Format international number (Egyptian standard if 01...)
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '2' + cleanPhone;
  } else if (cleanPhone.startsWith('1')) {
    cleanPhone = '20' + cleanPhone;
  }
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
