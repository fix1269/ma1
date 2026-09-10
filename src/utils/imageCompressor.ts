import imageCompression from 'browser-image-compression';

export interface CompressionResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  reductionPercentage: number;
  dimensions: { width: number; height: number };
}

/**
 * Client-Side Lightweight Image Compression Pipeline
 * Scales down dimensions (max 1024px) and compresses to small-kilobyte profile.
 */
export async function compressClientImage(
  file: File | Blob,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
  }
): Promise<CompressionResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  const defaultOptions = {
    maxSizeMB: options?.maxSizeMB || 0.15, // ~150KB target max
    maxWidthOrHeight: options?.maxWidthOrHeight || 1024,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: options?.quality || 0.72,
  };

  try {
    const compressedFile = await imageCompression(file as File, defaultOptions);
    const compressedSizeKb = Math.round(compressedFile.size / 1024);
    const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);

    // Calculate dimensions
    const dimensions = await getImageDimensions(dataUrl);
    const reductionPercentage = Math.max(
      0,
      Math.round(((originalSizeKb - compressedSizeKb) / (originalSizeKb || 1)) * 100)
    );

    return {
      dataUrl,
      originalSizeKb,
      compressedSizeKb,
      reductionPercentage,
      dimensions,
    };
  } catch (err) {
    console.warn('browser-image-compression fallback to Canvas pipeline:', err);
    return await fallbackCanvasCompression(file, defaultOptions.maxWidthOrHeight, defaultOptions.initialQuality);
  }
}

/**
 * High-speed fallback canvas compression pipeline
 */
function fallbackCanvasCompression(
  file: File | Blob,
  maxDimension = 1024,
  quality = 0.7
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const compressedSizeKb = Math.round((dataUrl.length * (3 / 4)) / 1024);
        const originalSizeKb = Math.round(file.size / 1024);

        resolve({
          dataUrl,
          originalSizeKb,
          compressedSizeKb,
          reductionPercentage: Math.max(
            0,
            Math.round(((originalSizeKb - compressedSizeKb) / (originalSizeKb || 1)) * 100)
          ),
          dimensions: { width, height },
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}
