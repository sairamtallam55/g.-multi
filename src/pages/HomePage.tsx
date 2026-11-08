import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bot,
  Waves,
  HeartPulse,
  Droplets,
  HelpCircle,
  Bus,
  Car,
  Accessibility,
  ShieldAlert,
  ArrowRight,
  Bell,
  Sparkles,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedText, filterFacilities } from '../utils/rules';
import type { FacilityCategory } from '../types';

export const HomePage: React.FC = () => {
  const { lang, t, facilities, announcements, safetyGuidelines } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/facilities?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const quickServices: {
    category: FacilityCategory | 'ghats' | 'medical' | 'transport';
    title: string;
    desc: string;
    icon: React.ElementType;
    to: string;
    gradient: string;
  }[] = [
    {
      category: 'ghats',
      title: t('quickGhats'),
      desc: 'Kotilingala, Pushkar Ghat, Kovvur & safety chains',
      icon: Waves,
      to: '/ghats',
      gradient: 'from-cyan-600 to-blue-700'
    },
    {
      category: 'medical',
      title: t('quickMedical'),
      desc: '24/7 First-aid camps, trauma blocks, ambulances',
      icon: HeartPulse,
      to: '/medical',
      gradient: 'from-rose-600 to-red-700'
    },
    {
      category: 'drinking_water',
      title: t('quickWater'),
      desc: 'Free RO chilled pure drinking water taps',
      icon: Droplets,
      to: '/facilities?category=drinking_water',
      gradient: 'from-sky-600 to-cyan-700'
    },
    {
      category: 'public_toilet',
      title: t('quickToilets'),
      desc: 'Sanitized bio-toilets and changing cubicles',
      icon: Sparkles,
      to: '/facilities?category=public_toilet',
      gradient: 'from-teal-600 to-emerald-700'
    },
    {
      category: 'police_station',
      title: t('quickPolice'),
      desc: 'Police outposts, missing person reporting',
      icon: HelpCircle,
      to: '/facilities?category=police_station',
      gradient: 'from-indigo-600 to-slate-800'
    },
    {
      category: 'transport',
      title: t('quickTransport'),
      desc: 'Free feeder buses, railway shuttle routes',
      icon: Bus,
      to: '/transport',
      gradient: 'from-amber-600 to-orange-700'
    },
    {
      category: 'parking_area',
      title: t('quickParking'),
      desc: 'Outer parking zones P1 to P4 & shuttles',
      icon: Car,
      to: '/facilities?category=parking_area',
      gradient: 'from-blue-600 to-indigo-800'
    },
    {
      category: 'accessibility_assistance',
      title: t('quickAccess'),
      desc: 'Wheelchair ramps & free battery buggies',
      icon: Accessibility,
      to: '/facilities?category=accessibility_assistance',
      gradient: 'from-purple-600 to-violet-800'
    }
  ];

  // Search live suggestions
  const liveSuggestions = searchInput.trim()
    ? filterFacilities(facilities, searchInput, 'ALL', 'ALL', lang).slice(0, 4)
    : [];

  const urgentAlerts = announcements
    .filter((a) => a.isPublished && (a.priority === 'CRITICAL' || a.priority === 'HIGH'))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a2540] via-[#0f4c64] to-[#0d9488] text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft decorative background patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold text-teal-200 mb-4 backdrop-blur-xs">
            <Waves className="w-3.5 h-3.5 text-teal-300" />
            <span>Godavari Pushkaralu 2027 • Smart Pilgrim Companion</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            {t('appName')}
          </h1>
          <p className="text-sm sm:text-lg text-teal-100 max-w-2xl mx-auto font-medium mb-6">
            {t('appTagline')}
          </p>

          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative mb-3">
            <div className="relative flex items-center shadow-xl rounded-2xl overflow-hidden bg-white text-slate-900 border-2 border-teal-400/60 focus-within:border-teal-500">
              <Search className="w-5 h-5 text-teal-600 ml-4 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full py-3.5 pl-3 pr-24 text-sm sm:text-base outline-none bg-transparent placeholder-slate-400 font-medium"
                aria-label="Global search facilities"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>{t('searchButton')}</span>
              </button>
            </div>

            {/* Instant auto-suggestions drop */}
            {liveSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 text-left z-30 overflow-hidden divide-y divide-slate-100">
                {liveSuggestions.map((fac) => (
                  <Link
                    key={fac.id}
                    to={`/facilities?selected=${fac.id}`}
                    className="p-3 flex items-center justify-between hover:bg-teal-50/60 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {getLocalizedText(fac.name, lang)}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {fac.locality} • {fac.address}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                      {fac.category.replace('_', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-teal-200/90 pt-2">
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Multilingual (తెలుగు, English, हिन्दी)</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Offline Ready PWA</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Emergency 112 Integrated</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Urgent Alerts / Announcements Bar if any */}
        {urgentAlerts.length > 0 && (
          <section aria-labelledby="alerts-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="alerts-heading" className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600 animate-bounce" />
                <span>Verified Alerts & Announcements</span>
              </h2>
              <Link to="/announcements" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
                <span>View All ({announcements.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {urgentAlerts.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-2xl border shadow-xs transition-shadow ${
                    ann.priority === 'CRITICAL'
                      ? 'bg-red-50/80 border-red-200 text-red-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                        ann.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                      }`}
                    >
                      {ann.priority} ALERT
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {ann.publicationDate}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm leading-snug mb-1">
                    {getLocalizedText(ann.title, lang)}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {getLocalizedText(ann.description, lang)}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 text-[10px]">{ann.source}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                      {ann.verificationStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Assistant Banner Card */}
        <section aria-label="AI Assistant Showcase" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a2540] via-[#0f4c64] to-[#115e59] p-6 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                <span>AI Multilingual Companion</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t('aiTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                Need immediate help finding drinking water, medical tents, ghat timings, or what to do if separated from your group? Ask freely in Telugu, Hindi, or English.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/assistant"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Bot className="w-4 h-4 text-slate-900" />
                <span>Start AI Chat Now</span>
              </Link>
              <Link
                to="/emergency"
                className="bg-red-600/90 hover:bg-red-600 text-white font-bold px-5 py-3 rounded-2xl text-sm border border-red-400/40 flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Dial 112 Help</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Access 8-Category Services Grid */}
        <section aria-labelledby="services-heading" className="space-y-4">
          <div>
            <h2 id="services-heading" className="text-lg sm:text-xl font-black text-slate-900">
              Essential Pilgrim Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Instant discovery of verified facilities, ghat locations, and aid across Rajamahendravaram and Kovvur.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.title}
                  to={svc.to}
                  className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-teal-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${svc.gradient} text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Safety Guidelines Highlights */}
        <section aria-labelledby="safety-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="safety-heading" className="text-lg sm:text-xl font-black text-slate-900">
                Vital Pilgrim Safety Guidelines
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Follow essential water safety, heat precautions, and crowd advisories during holy snanam.
              </p>
            </div>
            <Link
              to="/emergency"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Full Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {safetyGuidelines.slice(0, 3).map((safe) => (
              <div
                key={safe.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span>{getLocalizedText(safe.title, lang)}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getLocalizedText(safe.content, lang)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Offline Support & PWA Section */}
        <section aria-label="Offline capability" className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold">
              {t('offlineTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-sky-200 leading-relaxed">
              Mobile networks can become congested near bathing ghats. Godavari Sahaaya automatically caches emergency phone numbers, essential guidelines, and downloaded facility addresses to your device.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/offline"
              className="bg-white hover:bg-slate-100 text-sky-900 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md inline-flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Open Offline Pilgrim Guide</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
