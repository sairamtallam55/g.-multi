import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedText } from '../utils/rules';
import type { AnnouncementCategory } from '../types';

export const AnnouncementsPage: React.FC = () => {
  const { lang, t, announcements } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: 'All Announcements' },
    { key: 'safety_alert', label: 'Safety Alerts' },
    { key: 'route_advisory', label: 'Route Advisories' },
    { key: 'medical_info', label: 'Medical Info' },
    { key: 'transport_update', label: 'Transport Updates' },
    { key: 'facility_update', label: 'Facility Updates' },
    { key: 'festival_info', label: 'Festival Info' },
    { key: 'general', label: 'General' }
  ];

  const filtered = announcements.filter((ann) => {
    if (selectedCategory !== 'ALL' && ann.category !== selectedCategory) return false;
    if (selectedPriority !== 'ALL' && ann.priority !== selectedPriority) return false;
    if (!query.trim()) return true;

    const title = getLocalizedText(ann.title, lang).toLowerCase();
    const desc = getLocalizedText(ann.description, lang).toLowerCase();
    return title.includes(query.toLowerCase()) || desc.includes(query.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span>Public Information Broadcasts</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('navAnnouncements')} — Godavari Pushkaralu 2027
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Safety notifications, route diversion alerts, sanitation schedules, and water service bulletins for pilgrims.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search announcements by keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
              aria-label="Filter Priority"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === c.key
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Banner */}
      <div className="text-xs text-amber-900 bg-amber-50/80 p-3 rounded-xl border border-amber-200 flex items-center justify-between">
        <span className="font-medium">
          Demonstration announcements shown below reflect the simulated administrative bulletins for Pushkaralu 2027 operations.
        </span>
        <span className="font-bold text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
          DEMO DATA
        </span>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
            <Bell className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold">No announcements found matching the filters.</p>
          </div>
        ) : (
          filtered.map((ann) => {
            const isExpanded = expandedId === ann.id;
            const isCritical = ann.priority === 'CRITICAL';
            const isHigh = ann.priority === 'HIGH';

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                  isCritical
                    ? 'border-red-300 bg-red-50/30'
                    : isHigh
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div
                  className="cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : isHigh
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ann.priority}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {ann.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ann.publicationDate}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </div>
                  </div>

                  <h2 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                    {getLocalizedText(ann.title, lang)}
                  </h2>

                  <p
                    className={`text-xs text-slate-600 leading-relaxed mt-1.5 ${
                      !isExpanded ? 'line-clamp-2' : ''
                    }`}
                  >
                    {getLocalizedText(ann.description, lang)}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Source: {ann.source}</span>
                  <span className="font-bold text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {ann.verificationStatus}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
