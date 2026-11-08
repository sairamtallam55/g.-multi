import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Heart, Waves } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-[#07192b] text-slate-400 border-t border-slate-800 text-xs pb-20 md:pb-8 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                <Waves className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-wide">
                GODAVARI SAHAAYA
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              PS-04 • Intelligent Multilingual Pilgrim Assistance Platform for Godavari Pushkaralu 2027. Dedicated to safe, accessible, and dignified pilgrimage.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Free-tier • Privacy Preserving • No Paid Billing</span>
            </div>
          </div>

          {/* Column 2: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
              National Emergency Helplines
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">National Emergency Support:</span>
                <a href="tel:112" className="font-bold text-red-400 flex items-center gap-1 hover:underline">
                  <PhoneCall className="w-3.5 h-3.5" /> 112
                </a>
              </li>
              <li className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">Medical Ambulance:</span>
                <a href="tel:108" className="font-bold text-amber-400 flex items-center gap-1 hover:underline">
                  <PhoneCall className="w-3.5 h-3.5" /> 108
                </a>
              </li>
              <li className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">Child Protection Helpline:</span>
                <a href="tel:1098" className="font-bold text-sky-400 flex items-center gap-1 hover:underline">
                  <PhoneCall className="w-3.5 h-3.5" /> 1098
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
              Pilgrim Services
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/ghats" className="hover:text-teal-300 transition-colors">
                • {t('navGhats')}
              </Link>
              <Link to="/facilities" className="hover:text-teal-300 transition-colors">
                • {t('navFacilities')}
              </Link>
              <Link to="/medical" className="hover:text-teal-300 transition-colors">
                • {t('navMedical')}
              </Link>
              <Link to="/transport" className="hover:text-teal-300 transition-colors">
                • {t('navTransport')}
              </Link>
              <Link to="/lost-found" className="hover:text-teal-300 transition-colors">
                • {t('navLostFound')}
              </Link>
              <Link to="/offline" className="hover:text-teal-300 transition-colors">
                • {t('navOffline')}
              </Link>
              <Link to="/feedback" className="hover:text-teal-300 transition-colors">
                • {t('navFeedback')}
              </Link>
              <Link to="/about" className="hover:text-teal-300 transition-colors">
                • {t('navAbout')}
              </Link>
            </div>
          </div>

          {/* Column 4: Demonstration Transparency */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
              Demonstration Transparency
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400 bg-amber-950/20 border border-amber-800/30 p-2.5 rounded-lg text-amber-200/90">
              <strong className="text-amber-400">Notice:</strong> Synthetic facility positions and sample announcements are designated as demonstration planning records until authorized administrative verification.
            </p>
            <div className="pt-1">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-teal-300 underline"
              >
                Authorized Admin Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2026-2027 GODAVARI SAHAAYA (PS-04). Built for Godavari Pushkaralu Pilgrims.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for peaceful pilgrimage in Rajahmundry & Kovvur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
