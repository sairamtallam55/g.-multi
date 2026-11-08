import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Calendar,
  MapPin,
  Clock,
  Send,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { LostFoundReport } from '../types';

export const LostFoundPage: React.FC = () => {
  const { lang, t } = useApp();
  const [reports, setReports] = useState<Partial<LostFoundReport>[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'report'>('browse');

  // Form states
  const [reportType, setReportType] = useState<'LOST' | 'FOUND'>('LOST');
  const [itemCategory, setItemCategory] = useState('Wallets / Bags');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [approxLocation, setApproxLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [formStatus, setFormStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lost-found');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !approxLocation.trim() || !contactName.trim() || !contactInfo.trim()) {
      setFormStatus({ success: false, message: 'Please complete all required fields.' });
      return;
    }

    setSubmitting(true);
    setFormStatus(null);

    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          itemCategory,
          title,
          description,
          approxLocation,
          date,
          contactName,
          contactInfo
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormStatus({
          success: true,
          message: data.message || 'Report submitted! A police desk coordinator will contact you privately.'
        });
        setTitle('');
        setDescription('');
        setApproxLocation('');
        setContactName('');
        setContactInfo('');
      } else {
        setFormStatus({ success: false, message: data.error || 'Failed to submit report.' });
      }
    } catch {
      setFormStatus({ success: false, message: 'Network error submitting report. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
            <HelpCircle className="w-3.5 h-3.5 text-teal-300" />
            <span>Pilgrim Reunification & Belongings Desk</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('navLostFound')} — Godavari Pushkaralu 2027
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Report lost belongings or found items responsibly. Contact information is strictly confidential and kept private until authorized desk verification.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'browse'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Verified Public Inquiries ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'report'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          File New Lost or Found Report
        </button>
      </div>

      {activeTab === 'browse' ? (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl text-xs text-sky-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Privacy Protection Policy:</strong> Personal contact numbers are never published publicly. When claiming an item, visit Central Lost & Found Help Desk at Pushkar Ghat Gate 1 with government photo ID.
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-teal-500 mx-auto" />
              <p className="font-bold">No active unverified public lost/found items.</p>
              <p className="text-xs">If you have lost something, click "File New Lost or Found Report".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        r.type === 'LOST' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {r.type} ITEM
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{r.date}</span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900">{r.title}</h3>
                  <p className="text-xs text-slate-600">{r.description}</p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Location: {r.approxLocation}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-teal-700 font-semibold">{r.itemCategory}</span>
                    <span className="text-slate-400 font-mono text-[10px]">Desk Ref #{r.id?.slice(-4)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Report Form */
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">File a Confidential Report</h2>
            <p className="text-xs text-slate-500">
              Submitted details are securely routed to the Godavari Pushkaralu police help desk.
            </p>
          </div>

          {formStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                formStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Report Nature *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportType('LOST')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      reportType === 'LOST'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    I Lost an Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportType('FOUND')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      reportType === 'FOUND'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    I Found an Item
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Category *
                </label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
                >
                  <option value="Wallets / Bags">Wallets / Handbags</option>
                  <option value="Mobile Phones">Mobile Phones</option>
                  <option value="Identity Cards">Identity Cards / Documents</option>
                  <option value="Jewelry / Accessories">Jewelry / Accessories</option>
                  <option value="Keys">Keys</option>
                  <option value="Clothing / Shoes">Footwear / Clothing</option>
                  <option value="General Goods">Other General Goods</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Item Title / Summary *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Black leather wallet with Aadhar card"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description (Color, brand, identifying marks) *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide distinctive features to help the desk verify legitimate claims..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approximate Location / Ghat *
                </label>
                <input
                  type="text"
                  value={approxLocation}
                  onChange={(e) => setApproxLocation(e.target.value)}
                  placeholder="e.g. Near Kotilingala Ghat entrance steps"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date When Occurred *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Full name of pilgrim"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Phone Number *</span>
                  <span className="text-[10px] text-teal-700 flex items-center gap-0.5 font-normal">
                    <Lock className="w-3 h-3" /> Kept Private
                  </span>
                </label>
                <input
                  type="tel"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Mobile number for desk callback"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Confidential Report to Desk'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
