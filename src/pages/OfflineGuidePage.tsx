import React, { useState, useEffect } from 'react';
import {
  Download,
  Wifi,
  WifiOff,
  CheckCircle2,
  RefreshCw,
  PhoneCall,
  ShieldAlert,
  MapPin,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedText } from '../utils/rules';

export const OfflineGuidePage: React.FC = () => {
  const { lang, t, faqs, safetyGuidelines, facilities, isOnline, refreshAllData } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('last_offline_sync') || new Date().toLocaleTimeString();
  });

  useEffect(() => {
    // Listen for PWA beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('PWA installation is already active, or you can add to Home Screen from your mobile browser menu (⋮).');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await refreshAllData();
    const now = new Date().toLocaleTimeString();
    setLastSyncTime(now);
    localStorage.setItem('last_offline_sync', now);
    setSyncing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
            <Download className="w-3.5 h-3.5 text-teal-300" />
            <span>PWA & Offline Readiness</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('offlineTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            {t('offlineSub')}
          </p>
        </div>
      </div>

      {/* Online / Offline Status Badge */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
              isOnline ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          >
            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">
                {isOnline ? 'Connected Online' : 'Operating in Offline Mode'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {isOnline ? 'Live Updates Active' : 'Cached Data Only'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Last synchronized on your device at: <strong>{lastSyncTime}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={!isOnline || syncing}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Updates'}</span>
          </button>

          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install to Home Screen</span>
            </button>
          )}
        </div>
      </div>

      {/* Offline Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-2">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Guaranteed Available Offline:</span>
          </div>
          <ul className="space-y-1 text-emerald-900/90 pl-5 list-disc leading-relaxed">
            <li>National Emergency Helplines (112, 108, 1098, 181).</li>
            <li>All 10 vital river safety & crowd management guidelines.</li>
            <li>Core bathing ghat locations and landmark directions.</li>
            <li>Cached knowledge base FAQs and survival instructions.</li>
          </ul>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2">
          <div className="font-bold text-amber-950 flex items-center gap-1.5">
            <WifiOff className="w-4 h-4 text-amber-700" />
            <span>Requires Active Internet Connection:</span>
          </div>
          <ul className="space-y-1 text-amber-900/90 pl-5 list-disc leading-relaxed">
            <li>Streaming generative Gemini AI cloud conversations (local fallback answers instead).</li>
            <li>New dynamic map tile downloads from OpenStreetMap.</li>
            <li>Submitting new online feedback or lost-and-found reports.</li>
            <li>Live newly broadcast emergency alerts.</li>
          </ul>
        </div>
      </div>

      {/* Essential Offline Safety Mandates */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <span>Crucial Offline Emergency Instructions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <strong className="text-slate-900 font-bold block">1. River Snanam Safety:</strong>
            <p className="text-slate-600">
              Hold the stainless chains. Do not cross the yellow buoys. Never swim alone or let go of children in current.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <strong className="text-slate-900 font-bold block">2. In Case of Separation:</strong>
            <p className="text-slate-600">
              Immediately walk to Pushkar Ghat Gate 1 Police Outpost or Central Lost & Found Camp for public microphone broadcasts.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <strong className="text-slate-900 font-bold block">3. Medical Shock / Heat:</strong>
            <p className="text-slate-600">
              Sit in the shade, drink oral electrolytes, and alert volunteers. Dial 108 or 112 directly from your phone.
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <strong className="text-slate-900 font-bold block">4. Emergency Landmark:</strong>
            <p className="text-slate-600">
              Agree in advance with your family on an unmistakable landmark (e.g., Pushkar Ghat Police Watch Tower).
            </p>
          </div>
        </div>
      </div>

      {/* Cached Offline FAQs Accordion */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <span>Essential Cached FAQ Bank ({faqs.length} offline records)</span>
        </h2>

        <div className="divide-y divide-slate-100 space-y-2">
          {faqs.slice(0, 10).map((f) => (
            <div key={f.id} className="pt-2 text-xs">
              <h3 className="font-bold text-slate-900 mb-1">
                Q: {getLocalizedText(f.question, lang)}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                A: {getLocalizedText(f.answer, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
