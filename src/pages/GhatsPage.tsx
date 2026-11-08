import React, { useState } from 'react';
import {
  Waves,
  ShieldAlert,
  MapPin,
  CheckCircle,
  ExternalLink,
  Info,
  Clock,
  Compass,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedText } from '../utils/rules';

export const GhatsPage: React.FC = () => {
  const { lang, t, facilities } = useApp();
  const [selectedLocality, setSelectedLocality] = useState<string>('ALL');

  const ghats = facilities.filter((f) => f.category === 'bathing_ghat');
  const filteredGhats =
    selectedLocality === 'ALL'
      ? ghats
      : ghats.filter((g) => g.locality === selectedLocality);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-[#0a2540] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-400/20 text-teal-200 text-xs font-bold px-3 py-1 rounded-full">
            <Waves className="w-3.5 h-3.5 text-teal-300" />
            <span>Sacred Pushkaralu Riverbank Snanam</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('navGhats')} — Godavari Pushkaralu 2027
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Verified bathing ghat profiles along Rajahmundry and Kovvur banks, safety chains, changing facilities, and assistance counters.
          </p>
        </div>
      </div>

      {/* River Safety Advisory Box */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-black text-sm sm:text-base text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Crucial River Safety & Barricade Guidelines</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-900/90">
          • Hold firmly to the stainless steel safety chains installed along the ghat steps.<br />
          • Never swim beyond the floating yellow warning boundary buoys.<br />
          • Keep small children within arm’s reach at all times.<br />
          • Lifeguard towers and coastal police speedboats monitor designated ghats 24x7.
        </p>
        <div className="text-[11px] text-amber-800 font-semibold pt-1">
          * Notice: Real-time river flow rate and depth fluctuations vary with monsoon water release; obey onsite siren announcements.
        </div>
      </div>

      {/* Locality Filter Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700">Filter Ghats by Bank:</span>
        <div className="flex gap-1.5 text-xs font-bold">
          {['ALL', 'Rajahmundry', 'Kovvur'].map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocality(loc)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                selectedLocality === loc
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {loc === 'ALL' ? 'All Banks' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Ghat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGhats.map((ghat) => (
          <div
            key={ghat.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {ghat.locality} Bank
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {ghat.verificationStatus}
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {getLocalizedText(ghat.name, lang)}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ghat.address}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {getLocalizedText(ghat.description, lang)}
              </p>

              {/* Ghat Features Badges */}
              {ghat.accessibilityFeatures && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Features & Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ghat.accessibilityFeatures.map((f, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-sky-50 text-sky-800 border border-sky-200/60 px-2.5 py-0.5 rounded-lg font-medium"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ghat.capacityEstimated && (
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span><strong>Capacity:</strong> {ghat.capacityEstimated}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Source: {ghat.source}
              </span>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${ghat.latitude},${ghat.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                <span>{t('directions')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
