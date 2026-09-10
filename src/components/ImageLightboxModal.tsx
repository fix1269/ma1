import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';

interface ImageLightboxModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title = 'Car Inspection Photo',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
    setRotation(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
    setRotation(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
    setRotation(0);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `Vehicle_Photo_${currentIndex + 1}_${Date.now()}.jpg`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-white z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-sky-400">{title}</span>
          {images.length > 1 && (
            <span className="px-2 py-0.5 text-xs bg-slate-800 border border-slate-700 rounded-full font-mono text-slate-300">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-mono"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Download Image"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition ms-2"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute start-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-sky-600 text-white border border-slate-700 shadow-xl transition transform hover:scale-110"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute end-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-sky-600 text-white border border-slate-700 shadow-xl transition transform hover:scale-110"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Zoomable & Rotatable Image */}
        <div className="flex items-center justify-center max-w-full max-h-full transition-transform duration-200 ease-out">
          <img
            src={currentImage}
            alt="Vehicle angle inspect"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
            className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-slate-800 cursor-grab active:cursor-grabbing"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip (if multiple) */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/80 border-t border-slate-800 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
                setRotation(0);
              }}
              className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                idx === currentIndex
                  ? 'border-sky-500 ring-2 ring-sky-500/50 scale-105'
                  : 'border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white font-mono text-center">
                #{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
