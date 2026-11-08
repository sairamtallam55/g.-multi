import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';

import { HomePage } from './pages/HomePage';
import { AssistantPage } from './pages/AssistantPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { GhatsPage } from './pages/GhatsPage';
import { MedicalPage } from './pages/MedicalPage';
import { TransportPage } from './pages/TransportPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { OfflineGuidePage } from './pages/OfflineGuidePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  useEffect(() => {
    // Register PWA service worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white">
          {/* Official Demo Disclaimer Bar */}
          <DemoBanner />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Routed Page Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/ghats" element={<GhatsPage />} />
              <Route path="/medical" element={<MedicalPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/lost-found" element={<LostFoundPage />} />
              <Route path="/offline" element={<OfflineGuidePage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Mobile Bottom Navigation (Smartphones) */}
          <BottomNav />

          {/* Desktop & Mobile Global Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
