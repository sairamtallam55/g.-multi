import React, { useState } from 'react';
import {
  Bus,
  Car,
  MapPin,
  ExternalLink,
  Navigation,
  Info,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedText } from '../utils/rules';

export const TransportPage: React.FC = () => {
  const { lang, t, facilities, announcements } = useApp();
  const [tab, setTab] = useState<'parking' | 'buses' | 'advisories'>('parking');

  const parkingFacilities = facilities.filter((f) => f.category === 'parking_area');
  const busFacilities = facilities.filter((f) => f.category === 'bus_stop');
  const transportAnnouncements = announcements.filter(
    (a) => a.category === 'transport_update' || a.category === 'route_advisory'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
            <Bus className="w-3.5 h-3.5 text-blue-300" />
            <span>Transit & Outer Parking Infrastructure</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('navTransport')} — Godavari Pushkaralu 2027
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Free municipal shuttle buses, designated outer vehicle parking grounds (P1 to P4), railway station feeder shuttles, and highway traffic diversions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('parking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'parking'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Parking Zones ({parkingFacilities.length})</span>
        </button>

        <button
          onClick={() => setTab('buses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'buses'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Shuttle Bus Terminals ({busFacilities.length})</span>
        </button>

        <button
          onClick={() => setTab('advisories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'advisories'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Route Advisories ({transportAnnouncements.length})</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="text-xs text-slate-600 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Free government green feeder buses operate on continuous loops from outer parking directly to ghat concourses.</span>
        </div>
        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
          DEMO DATA — NOT OFFICIAL
        </span>
      </div>

      {/* Tab 1: Parking */}
      {tab === 'parking' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parkingFacilities.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    Designated Parking
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {p.verificationStatus}
                  </span>
                </div>
                <h2 className="text-base font-black text-slate-900">
                  {getLocalizedText(p.name, lang)}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getLocalizedText(p.description, lang)}
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.address}</span>
                </div>
                {p.capacityEstimated && (
                  <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg">
                    Capacity: {p.capacityEstimated}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">24/7 Monitored</span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5"
                >
                  <span>{t('directions')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Buses */}
      {tab === 'buses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {busFacilities.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Shuttle Feeder Stop
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {b.verificationStatus}
                  </span>
                </div>
                <h2 className="text-base font-black text-slate-900">
                  {getLocalizedText(b.name, lang)}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getLocalizedText(b.description, lang)}
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{b.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold">Free Feeder Service</span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5"
                >
                  <span>{t('directions')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Route Advisories */}
      {tab === 'advisories' && (
        <div className="space-y-3">
          {transportAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                  {ann.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 font-mono">{ann.publicationDate}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {getLocalizedText(ann.title, lang)}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {getLocalizedText(ann.description, lang)}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Source: {ann.source}</span>
                <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                  {ann.verificationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
