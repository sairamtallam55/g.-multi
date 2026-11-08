import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Languages,
  PhoneCall,
  WifiOff,
  Home,
  Bot,
  MapPin,
  Waves,
  HeartPulse,
  Bus,
  Bell,
  ShieldAlert,
  Download,
  MessageSquare,
  Lock,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Language } from '../types';

export const Navbar: React.FC = () => {
  const { lang, setLang, t, isOnline, isAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', label: t('navHome'), icon: Home },
    { to: '/assistant', label: t('navAssistant'), icon: Bot, highlight: true },
    { to: '/facilities', label: t('navFacilities'), icon: MapPin },
    { to: '/ghats', label: t('navGhats'), icon: Waves },
    { to: '/medical', label: t('navMedical'), icon: HeartPulse },
    { to: '/transport', label: t('navTransport'), icon: Bus },
    { to: '/announcements', label: t('navAnnouncements'), icon: Bell },
    { to: '/emergency', label: t('navEmergency'), icon: ShieldAlert, danger: true },
    { to: '/offline', label: t('navOffline'), icon: Download },
    { to: '/feedback', label: t('navFeedback'), icon: MessageSquare },
    { to: '/about', label: t('navAbout'), icon: Info },
    { to: '/admin', label: t('navAdmin'), icon: Lock, adminOnly: true }
  ];

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0a2540] text-white shadow-md border-b border-teal-500/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg p-1"
            aria-label="Godavari Sahaaya Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-sky-600 to-amber-400 p-0.5 shadow flex items-center justify-center shrink-0">
              <img src="/icon-192.svg" alt="Godavari Logo" className="w-full h-full rounded-[10px]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  GODAVARI SAHAAYA
                </span>
                <span className="text-[10px] uppercase font-bold bg-teal-500/30 text-teal-300 px-1.5 py-0.5 rounded border border-teal-400/30">
                  2027
                </span>
              </div>
              <p className="text-[10px] text-teal-200/80 font-medium hidden sm:block truncate max-w-[280px]">
                {t('appTagline')}
              </p>
            </div>
          </Link>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Offline indicator badge */}
            {!isOnline && (
              <div
                className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs px-2 py-1 rounded-full animate-pulse"
                title="Working Offline"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-[11px] font-semibold">Offline</span>
              </div>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-[#0e3559] border border-teal-500/30 rounded-lg p-0.5 text-xs">
              <Languages className="w-3.5 h-3.5 text-teal-300 ml-1.5 mr-0.5" />
              <button
                type="button"
                onClick={() => handleLangChange('te')}
                aria-label="Switch to Telugu"
                className={`px-1.5 py-1 rounded transition-colors font-medium ${
                  lang === 'te' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('en')}
                aria-label="Switch to English"
                className={`px-1.5 py-1 rounded transition-colors font-medium ${
                  lang === 'en' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('hi')}
                aria-label="Switch to Hindi"
                className={`px-1.5 py-1 rounded transition-colors font-medium ${
                  lang === 'hi' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Emergency 112 quick pill */}
            <Link
              to="/emergency"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-transform active:scale-95"
              aria-label="Emergency Services 112"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span className="font-extrabold tracking-wider">112</span>
            </Link>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0e3559] text-teal-200 hover:text-white hover:bg-teal-900/40 border border-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-start"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[#0a2540] border-b border-teal-500/30 shadow-2xl max-h-[85vh] overflow-y-auto px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-xs'
                        : item.danger
                        ? 'text-red-400 hover:bg-red-950/40'
                        : item.highlight
                        ? 'text-amber-300 hover:bg-amber-950/40'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.adminOnly && isAdmin && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                        Active
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>PS-04 Godavari Pushkaralu 2027</span>
              <span className="text-teal-400 font-medium">Free & Open Companion</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
