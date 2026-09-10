import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { OffersCarousel } from './components/OffersCarousel';
import { CarLookupBox } from './components/CarLookupBox';
import { ServicesGrid } from './components/ServicesGrid';
import { GeminiAICard } from './components/GeminiAICard';
import { MonetizationAdBanner } from './components/MonetizationAdBanner';
import { FloatingActionButtons } from './components/FloatingActionButtons';
import { Footer } from './components/Footer';
import { DeveloperModal } from './components/DeveloperModal';
import { AdminGatewayModal } from './components/AdminGatewayModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DigitalServiceLogModal } from './components/DigitalServiceLogModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { PolicyModal } from './components/PolicyModal';

const MainLayout: React.FC = () => {
  const { theme, language } = useApp();

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100 font-cairo selection:bg-sky-500 selection:text-white'
          : 'bg-slate-900 text-slate-100 font-cairo selection:bg-sky-500 selection:text-white'
      } flex flex-col justify-between antialiased transition-colors duration-300`}
    >
      {/* Top Fixed Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Section 1: Hero Banner */}
        <HeroBanner />

        {/* Section 2: Auto-Rotating Offers Carousel (10s timer) */}
        <OffersCarousel />

        {/* Section 3: Smart Client Car Lookup & Live Log Search */}
        <CarLookupBox />

        {/* Section 4: Public Services Matrix (6 cards with full popups) */}
        <ServicesGrid />

        {/* Section 5: Official Google Gemini Neon Glowing Card */}
        <GeminiAICard />
      </main>

      {/* Edge-to-Edge Sticky Monetization Ad Banner */}
      <MonetizationAdBanner />

      {/* Floating Instant Action Buttons (WhatsApp, Phone, Google Maps) */}
      <FloatingActionButtons />

      {/* Footer with Legal Pages, 1-Click Developer Profile & 5-Tap Secret Admin */}
      <Footer />

      {/* Modals & Portals */}
      <DeveloperModal />
      <AdminGatewayModal />
      <AdminDashboard />
      <DigitalServiceLogModal />
      <ServiceDetailModal />
      <PolicyModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
