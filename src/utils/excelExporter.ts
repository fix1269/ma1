import * as XLSX from 'xlsx';
import { Customer, Invoice } from '../types';

/**
 * Export Customer records to a formatted Excel workbook (.xlsx)
 */
export function exportCustomersToExcel(customers: Customer[], periodLabel = 'All') {
  const data = customers.map((c, index) => {
    const criticalCount = c.services.filter((s) => s.status === 'critical').length;
    const mediumCount = c.services.filter((s) => s.status === 'medium').length;
    const nextDue = c.services
      .map((s) => s.nextDueDate)
      .filter(Boolean)
      .sort()[0] || 'N/A';

    const totalCost = c.services.reduce((acc, s) => acc + (s.cost || 0), 0);
    const servicesList = c.services.map((s) => `${s.name} (${s.status.toUpperCase()})`).join(' | ');

    return {
      '#': index + 1,
      'اسم العميل / Client Name': c.fullName,
      'رقم الهاتف / Phone': c.phone,
      'موديل السيارة / Car Model': c.carModel,
      'رقم اللوحة / Plate': c.plateNumber,
      'رقم الشاسيه / VIN': c.vin || 'N/A',
      'عداد الكيلومتر / Odometer (KM)': c.odometer,
      'حالة الصيانات الحرجة / Critical Alerts': criticalCount,
      'صيانات المتابعة / Attention Needed': mediumCount,
      'تاريخ الاستحقاق القادم / Next Due': nextDue,
      'إجمالي التكلفة التقديرية / Total Cost (EGP)': totalCost,
      'بيان الصيانات / Services List': servicesList,
      'تاريخ الإنشاء / Date Created': new Date(c.createdAt).toLocaleDateString('en-GB'),
      'ملاحظات الورشة / Notes': c.notes || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths for beautiful layout
  worksheet['!cols'] = [
    { wch: 5 },  // #
    { wch: 28 }, // Name
    { wch: 15 }, // Phone
    { wch: 25 }, // Car Model
    { wch: 16 }, // Plate
    { wch: 20 }, // VIN
    { wch: 16 }, // Odometer
    { wch: 14 }, // Critical
    { wch: 14 }, // Medium
    { wch: 16 }, // Next Due
    { wch: 18 }, // Total Cost
    { wch: 45 }, // Services List
    { wch: 14 }, // Date
    { wch: 30 }, // Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Customers_${periodLabel}`);

  const fileName = `AutoMaster_Customers_${periodLabel}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Export Invoice records to a formatted Excel workbook (.xlsx)
 */
export function exportInvoicesToExcel(invoices: Invoice[], periodLabel = 'All') {
  const data = invoices.map((inv, index) => {
    const itemsDescription = inv.items
      .map((item) => `${item.description} (x${item.qty} @ ${item.unitPrice} = ${item.total} EGP)`)
      .join(' | ');

    return {
      '#': index + 1,
      'رقم الفاتورة / Invoice #': inv.invoiceNumber,
      'التاريخ / Date': inv.date,
      'اسم العميل / Client Name': inv.customerName,
      'الهاتف / Phone': inv.customerPhone,
      'رقم اللوحة / Plate': inv.plateNumber,
      'السيارة / Car Model': inv.carModel,
      'العداد / Odometer (KM)': inv.currentOdometer,
      'عدد البنود / Items Count': inv.items.length,
      'تفاصيل البنود / Line Items': itemsDescription,
      'المجموع الفرعي / Subtotal (EGP)': inv.subtotal,
      'ضريبة القيمة المضافة / VAT Amount (14%)': inv.taxAmount,
      'قيمة الخصم / Discount (EGP)': inv.discountAmount,
      'الإجمالي النهائي / Total (EGP)': inv.total,
      'حالة الدفع / Payment Status': inv.paymentStatus.toUpperCase(),
      'ملاحظات / Notes': inv.notes || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // #
    { wch: 16 }, // Inv #
    { wch: 12 }, // Date
    { wch: 25 }, // Client Name
    { wch: 15 }, // Phone
    { wch: 14 }, // Plate
    { wch: 22 }, // Car Model
    { wch: 14 }, // Odometer
    { wch: 12 }, // Items Count
    { wch: 45 }, // Line Items
    { wch: 16 }, // Subtotal
    { wch: 16 }, // Tax
    { wch: 14 }, // Discount
    { wch: 18 }, // Total
    { wch: 14 }, // Payment Status
    { wch: 25 }, // Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Invoices_${periodLabel}`);

  const fileName = `AutoMaster_Invoices_${periodLabel}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
