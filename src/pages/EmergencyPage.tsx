import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Users,
  Compass,
  Waves,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedText } from '../utils/rules';

export const EmergencyPage: React.FC = () => {
  const { lang, t, safetyGuidelines } = useApp();

  const emergencyContacts = [
    {
      title: 'National Emergency Support (Police, Fire, Ambulance, SDRF)',
      number: '112',
      desc: 'Single emergency helpline across India. Accessible toll-free 24x7 from any mobile device even without balance or SIM card roaming.',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      accent: 'border-red-300'
    },
    {
      title: 'Medical Ambulance Helpline',
      number: '108',
      desc: 'Free state-wide emergency medical ambulance dispatch for acute chest pain, trauma, unconsciousness, and heat stroke.',
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      accent: 'border-amber-300'
    },
    {
      title: 'Childline Protection & Missing Child Help',
      number: '1098',
      desc: 'Dedicated 24/7 service for children found wandering alone, lost in crowds, or in need of emergency shelter.',
      color: 'bg-sky-600 hover:bg-sky-700 text-white',
      accent: 'border-sky-300'
    },
    {
      title: 'Women Safety & Crisis Helpline',
      number: '181',
      desc: 'Instant support, protection, and police escort coordination for women pilgrims and mothers with infants.',
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
      accent: 'border-purple-300'
    }
  ];

  const protocols = [
    {
      title: 'If a Child or Family Member is Separated in Crowds',
      steps: [
        'Do not panic. Stay at the last seen spot for 2 minutes while one person proceeds immediately to the nearest Police Help Desk or Public Address Booth.',
        'Request an instant public address broadcast across all ghat speakers with the person\'s name, clothing color, and pre-agreed landmark.',
        'Visit the Central Lost & Found Reunification Camp at Pushkar Ghat Gate 1.',
        'Call Childline 1098 or 112 if a child remains untraced.'
      ]
    },
    {
      title: 'If Someone Faints or Experiences Heat Exhaustion',
      steps: [
        'Move the individual into shaded, ventilated shelter immediately.',
        'Loosen tight clothing and gently elevate their feet slightly above heart level.',
        'Provide small sips of cool ORS or water only if fully conscious.',
        'Alert the nearest Red Cross volunteer or dial 108 for emergency oxygen and triage.'
      ]
    },
    {
      title: 'In Case of Sudden River Water Level Surge or Distress',
      steps: [
        'Immediately exit the water and step up to higher dry stone terraces.',
        'Never jump into deep currents to rescue someone without a life-jacket or float tube.',
        'Throw a nearby rope or floating life-buoy towards the person in distress.',
        'Shout loudly to alert the stationed Coastal Police boat and SDRF scuba divers.'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Operations</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('emergencyHeader')}
          </h1>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
            {t('emergencySub')}
          </p>
        </div>
      </div>

      {/* Primary Emergency Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyContacts.map((c) => (
          <div
            key={c.number}
            className={`bg-white rounded-3xl p-5 border-2 ${c.accent} shadow-md flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Toll-Free Helpline
                </span>
                <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  24x7 ACTIVE
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                {c.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {c.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href={`tel:${c.number}`}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 ${c.color}`}
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>DIAL {c.number} DIRECTLY</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Action Protocols */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Step-by-Step Emergency Response Guides</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {protocols.map((proto, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                {proto.title}
              </h3>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4 leading-relaxed">
                {proto.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Full Safety Guidelines Cards */}
      <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Godavari Pushkaralu Pilgrim Safety Mandates
          </h2>
          <p className="text-xs text-slate-500">
            Essential community advisories for a smooth, respectful, and accident-free holy bath.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {safetyGuidelines.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{getLocalizedText(s.title, lang)}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {getLocalizedText(s.content, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
