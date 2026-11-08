import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, Facility, Announcement, FAQ, SafetyGuideline } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  facilities: Facility[];
  announcements: Announcement[];
  faqs: FAQ[];
  safetyGuidelines: SafetyGuideline[];
  loadingData: boolean;
  isOnline: boolean;
  adminToken: string | null;
  isAdmin: boolean;
  adminLogin: (password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  refreshAllData: () => Promise<void>;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('godavari_sahaaya_lang');
    if (saved === 'te' || saved === 'hi' || saved === 'en') return saved;
    return 'en';
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [safetyGuidelines, setSafetyGuidelines] = useState<SafetyGuideline[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('godavari_sahaaya_admin_token');
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('godavari_sahaaya_lang', newLang);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshAllData = async () => {
    setLoadingData(true);
    try {
      const [facRes, annRes, faqRes, safeRes] = await Promise.all([
        fetch('/api/facilities'),
        fetch('/api/announcements'),
        fetch('/api/faqs'),
        fetch('/api/safety-guidelines')
      ]);

      if (facRes.ok) {
        const facData = await facRes.json();
        setFacilities(facData);
        localStorage.setItem('cached_facilities', JSON.stringify(facData));
      }
      if (annRes.ok) {
        const annData = await annRes.json();
        setAnnouncements(annData);
        localStorage.setItem('cached_announcements', JSON.stringify(annData));
      }
      if (faqRes.ok) {
        const faqData = await faqRes.json();
        setFaqs(faqData);
        localStorage.setItem('cached_faqs', JSON.stringify(faqData));
      }
      if (safeRes.ok) {
        const safeData = await safeRes.json();
        setSafetyGuidelines(safeData);
        localStorage.setItem('cached_safety', JSON.stringify(safeData));
      }
    } catch (err) {
      console.warn('Network fetch failed, attempting cached offline recovery:', err);
      // Restore from local cache if offline
      const cachedFac = localStorage.getItem('cached_facilities');
      if (cachedFac) setFacilities(JSON.parse(cachedFac));
      const cachedAnn = localStorage.getItem('cached_announcements');
      if (cachedAnn) setAnnouncements(JSON.parse(cachedAnn));
      const cachedFaq = localStorage.getItem('cached_faqs');
      if (cachedFaq) setFaqs(JSON.parse(cachedFaq));
      const cachedSafe = localStorage.getItem('cached_safety');
      if (cachedSafe) setSafetyGuidelines(JSON.parse(cachedSafe));
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const adminLogin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAdminToken(data.token);
        localStorage.setItem('godavari_sahaaya_admin_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error contacting authentication service' };
    }
  };

  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('godavari_sahaaya_admin_token');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        facilities,
        announcements,
        faqs,
        safetyGuidelines,
        loadingData,
        isOnline,
        adminToken,
        isAdmin: !!adminToken,
        adminLogin,
        adminLogout,
        refreshAllData,
        globalSearchQuery,
        setGlobalSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
