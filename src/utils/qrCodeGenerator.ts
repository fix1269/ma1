import QRCode from 'qrcode';

/**
 * Generate a dynamic QR code Data URL (PNG) for any URL or invoice verification string
 */
export async function generateQRCodeDataUrl(text: string, size = 200): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('QR Code generation error:', err);
    return '';
  }
}
