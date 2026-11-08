import React, { useState } from 'react';
import {
  HeartPulse,
  PhoneCall,
  MapPin,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Activity,
  Droplets,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedText } from '../utils/rules';

export const MedicalPage: React.FC = () => {
  const { lang, t, facilities } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'hospital' | 'medical_camp'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const medicalFacilities = facilities.filter(
    (f) => f.category === 'hospital' || f.category === 'medical_camp'
  );

  const filtered = medicalFacilities.filter((f) => {
    if (filterType !== 'ALL' && f.category !== filterType) return false;
    if (!searchTerm.trim()) return true;
    const name = getLocalizedText(f.name, lang).toLowerCase();
    const loc = f.locality.toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || loc.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-red-900 to-[#0a2540] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-200 text-xs font-bold px-3 py-1 rounded-full border border-red-400/30">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>24/7 Emergency Health Response</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('navMedical')} — Pushkaralu Medical Network
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Emergency trauma stations, triage doctors, free ORS rehydration counters, and hospital ambulance contacts across Pushkaralu zones.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="tel:108"
              className="bg-white hover:bg-rose-50 text-red-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-red-600 animate-pulse" />
              <span>Call 108 Ambulance</span>
            </a>
            <a
              href="tel:112"
              className="bg-red-700/80 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm border border-red-400/40 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>National Emergency 112</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Important Medical Disclaimer</span>
        </div>
        <p className="leading-relaxed text-amber-900/90">
          This digital assistance platform provides navigational discovery to help pilgrims locate nearby first-aid posts and emergency triage centers during Godavari Pushkaralu. It is not a substitute for professional clinical medical advice or diagnosis. In acute chest pain, severe injury, or loss of consciousness, immediately alert nearby volunteers and dial 108 / 112.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hospital or camp..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex gap-2 text-xs font-bold w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'All Medical Units' },
            { key: 'medical_camp', label: 'Ghat Medical Camps' },
            { key: 'hospital', label: 'Hospitals' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterType(item.key as any)}
              className={`px-3 py-2 rounded-xl transition-colors ${
                filterType === item.key
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  {item.category === 'hospital' ? 'Tertiary Hospital' : 'Emergency Triage Camp'}
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {item.verificationStatus}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {getLocalizedText(item.name, lang)}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {getLocalizedText(item.description, lang)}
              </p>

              <div className="text-xs text-slate-500 space-y-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.address} ({item.locality})</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>24 Hours Active Service</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {item.contactNumber ? (
                <a
                  href={`tel:${item.contactNumber}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {item.contactNumber}</span>
                </a>
              ) : (
                <span className="text-[11px] text-slate-400">Emergency Stationed</span>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
              >
                <span>{t('directions')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
