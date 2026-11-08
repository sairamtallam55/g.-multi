import React from 'react';
import {
  Waves,
  ShieldCheck,
  Bot,
  MapPin,
  Cpu,
  Heart,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-[#0a2540] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
            <Waves className="w-3.5 h-3.5 text-teal-300" />
            <span>Problem Statement PS-04</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            About GODAVARI SAHAAYA
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Godavari Pushkaralu 2027 | AI-Powered Multilingual Pilgrim Assistance Platform
          </p>
        </div>
      </div>

      {/* Mission & Purpose */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>Our Sacred Mission</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Godavari Pushkaralu is one of India's most sacred river festivals, occurring once every 12 years when millions of devotees arrive at Rajamahendravaram, Kovvur, and along the banks of the sacred Godavari for holy snanam and ancestral homage.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>GODAVARI SAHAAYA (PS-04)</strong> was conceived to solve the critical challenges pilgrims face in dense crowd environments: navigating unknown bathing ghats, discovering emergency medical relief, locating clean drinking water and bio-toilets, reuniting separated family members, and receiving real-time safety advisories in their native language (Telugu, Hindi, and English).
        </p>
      </div>

      {/* Free-First Architecture Commitment */}
      <div className="bg-emerald-50/80 rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Zero Paid Billing & Free-First Architecture</span>
        </h2>
        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
          In strict compliance with free and open civic access standards:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-900">
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>OpenStreetMap & Leaflet:</strong> Interactive spatial mapping requires zero paid Google Maps API keys or subscriptions.
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Grounded Gemini + Local Fallback:</strong> Generative AI runs with automatic offline / local FAQ retrieval fallback if quota is exhausted.
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>PWA Offline Shell:</strong> Essential emergency guides, helplines, and cached facilities operate without cellular connectivity.
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Privacy Guaranteed:</strong> Lost and found contact phone numbers remain completely confidential and are never exposed publicly.
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-teal-600" />
          <span>Engineered Technology Stack</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold text-[10px]">Frontend</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">React 19 + TypeScript</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold text-[10px]">Backend</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">Node.js + Express REST</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold text-[10px]">Styling</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">Tailwind CSS v4</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold text-[10px]">AI Assistant</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">Gemini API SDK</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold text-[10px]">Interactive Maps</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">Leaflet + OpenStreetMap</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-slate-400 font-semibold text-[10px]">Analytics</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">Recharts Dashboard</div>
          </div>
        </div>
      </div>
    </div>
  );
};
