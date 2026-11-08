import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  BarChart3,
  Building,
  Bell,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getLocalizedText } from '../utils/rules';
import type { Facility, Announcement, FAQ, LostFoundReport, FeedbackItem, FacilityCategory } from '../types';

export const AdminPage: React.FC = () => {
  const { lang, t, isAdmin, adminToken, adminLogin, adminLogout, refreshAllData } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [adminSection, setAdminSection] = useState<
    'overview' | 'facilities' | 'announcements' | 'faqs' | 'lostfound' | 'feedback'
  >('overview');

  // Admin loaded data
  const [analytics, setAnalytics] = useState<any>(null);
  const [facilitiesList, setFacilitiesList] = useState<Facility[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [faqsList, setFaqsList] = useState<FAQ[]>([]);
  const [lostFoundList, setLostFoundList] = useState<LostFoundReport[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Facility Form Modal
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [facForm, setFacForm] = useState({
    nameEn: '',
    nameTe: '',
    nameHi: '',
    category: 'drinking_water' as FacilityCategory,
    descEn: '',
    descTe: '',
    descHi: '',
    locality: 'Rajahmundry',
    address: '',
    latitude: 17.002,
    longitude: 81.775,
    contactNumber: '',
    verificationStatus: 'DEMO'
  });

  // Announcement Form Modal
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annForm, setAnnForm] = useState({
    titleEn: '',
    titleTe: '',
    titleHi: '',
    descEn: '',
    descTe: '',
    descHi: '',
    category: 'general' as any,
    priority: 'MEDIUM' as any,
    source: 'Pushkaralu Control Desk',
    verificationStatus: 'VERIFIED'
  });

  const fetchAdminData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const [anaRes, facRes, annRes, faqRes, lfRes, fbRes] = await Promise.all([
        fetch('/api/analytics', { headers }),
        fetch('/api/facilities'),
        fetch('/api/announcements'),
        fetch('/api/faqs'),
        fetch('/api/lost-found', { headers }),
        fetch('/api/feedback', { headers })
      ]);

      if (anaRes.ok) setAnalytics(await anaRes.json());
      if (facRes.ok) setFacilitiesList(await facRes.json());
      if (annRes.ok) setAnnouncementsList(await annRes.json());
      if (faqRes.ok) setFaqsList(await faqRes.json());
      if (lfRes.ok) setLostFoundList(await lfRes.json());
      if (fbRes.ok) setFeedbackList(await fbRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, adminToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await adminLogin(passwordInput);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Check your password.');
    }
  };

  const handleVerifyFacility = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'VERIFIED' ? 'DEMO' : 'VERIFIED';
    try {
      const res = await fetch(`/api/facilities/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: nextStatus,
          source: nextStatus === 'VERIFIED' ? 'District Administration Authorized' : 'Demonstration Record'
        })
      });
      if (res.ok) {
        setActionMessage(`Facility verification status set to ${nextStatus}`);
        fetchAdminData();
        refreshAllData();
      }
    } catch {
      setActionMessage('Failed to update verification status.');
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (!window.confirm('Delete this facility record?')) return;
    try {
      const res = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setActionMessage('Facility removed');
        fetchAdminData();
        refreshAllData();
      }
    } catch {
      setActionMessage('Error deleting facility.');
    }
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: { en: facForm.nameEn, te: facForm.nameTe || facForm.nameEn, hi: facForm.nameHi || facForm.nameEn },
      category: facForm.category,
      description: { en: facForm.descEn, te: facForm.descTe || facForm.descEn, hi: facForm.descHi || facForm.descEn },
      locality: facForm.locality,
      address: facForm.address,
      latitude: facForm.latitude,
      longitude: facForm.longitude,
      contactNumber: facForm.contactNumber || undefined,
      verificationStatus: facForm.verificationStatus,
      source: facForm.verificationStatus === 'VERIFIED' ? 'District Official Desk' : 'Demonstration Entry'
    };

    try {
      let res;
      if (editingFacility) {
        res = await fetch(`/api/facilities/${editingFacility.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/facilities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setShowFacilityModal(false);
        setEditingFacility(null);
        setActionMessage(editingFacility ? 'Facility updated successfully' : 'New facility created');
        fetchAdminData();
        refreshAllData();
      }
    } catch {
      setActionMessage('Failed to save facility.');
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: { en: annForm.titleEn, te: annForm.titleTe || annForm.titleEn, hi: annForm.titleHi || annForm.titleEn },
      description: { en: annForm.descEn, te: annForm.descTe || annForm.descEn, hi: annForm.descHi || annForm.descEn },
      category: annForm.category,
      priority: annForm.priority,
      source: annForm.source,
      verificationStatus: annForm.verificationStatus
    };

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAnnModal(false);
        setActionMessage('Announcement broadcasted successfully');
        fetchAdminData();
        refreshAllData();
      }
    } catch {
      setActionMessage('Failed to publish announcement.');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('Delete announcement?')) return;
    try {
      await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setActionMessage('Announcement deleted');
      fetchAdminData();
      refreshAllData();
    } catch {
      setActionMessage('Failed to delete announcement');
    }
  };

  const handleUpdateLfStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/lost-found/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      setActionMessage(`Report status updated to ${status}`);
      fetchAdminData();
    } catch {
      setActionMessage('Error updating report status.');
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset database to clean standard Pushkaralu 2027 initial demo dataset?')) return;
    try {
      const res = await fetch('/api/admin/reset-seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setActionMessage('Database reset successfully to initial demo baseline.');
        fetchAdminData();
        refreshAllData();
      }
    } catch {
      setActionMessage('Failed to reset dataset.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5 text-center">
          <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{t('adminTitle')}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter administrator passkey to access operational controls and facility management.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-xl font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Passkey
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (e.g. Pushkaralu2027@Sahaaya)"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-mono"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Demo access key: <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-800 font-bold">Pushkaralu2027@Sahaaya</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-800 font-bold">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{t('login')}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Analytics charts preparation
  const categoryChartData = analytics?.categoryCounts
    ? Object.entries(analytics.categoryCounts).map(([cat, count]) => ({
        name: cat.replace('_', ' ').slice(0, 12),
        count
      }))
    : [];

  const verificationPieData = analytics
    ? [
        { name: 'Verified', value: analytics.verifiedFacilities, color: '#10b981' },
        { name: 'Demo Data', value: analytics.demoFacilities, color: '#f59e0b' },
        { name: 'Unverified', value: analytics.unverifiedFacilities, color: '#94a3b8' }
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Admin Header */}
      <div className="bg-[#0a2540] text-white p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black">
                {t('adminTitle')}
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold px-2 py-0.5 rounded">
                Admin Session Active
              </span>
            </div>
            <p className="text-xs text-teal-200/80">
              Godavari Pushkaralu 2027 Operations & Facility Verification Command
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handleResetSeed}
            className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            title="Reset standard demo baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t('resetSeed')}</span>
          </button>

          <button
            onClick={adminLogout}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl flex items-center justify-between font-medium">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-950 font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Admin Navigation Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        {[
          { key: 'overview', label: 'Analytics & Overview', icon: BarChart3 },
          { key: 'facilities', label: `Facilities (${facilitiesList.length})`, icon: Building },
          { key: 'announcements', label: `Announcements (${announcementsList.length})`, icon: Bell },
          { key: 'faqs', label: `FAQs (${faqsList.length})`, icon: HelpCircle },
          { key: 'lostfound', label: `Lost & Found (${lostFoundList.length})`, icon: ShieldAlert },
          { key: 'feedback', label: `Feedback (${feedbackList.length})`, icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = adminSection === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setAdminSection(tab.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                active
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Overview & Analytics */}
      {adminSection === 'overview' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold">Total Facilities</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {analytics?.totalFacilities || facilitiesList.length}
              </div>
              <span className="text-[10px] text-teal-600 font-bold mt-1 block">
                {analytics?.verifiedFacilities || 0} Verified • {analytics?.demoFacilities || 0} Demo
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold">Announcements</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {analytics?.totalAnnouncements || announcementsList.length}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {analytics?.publishedAnnouncements || 0} Published Live
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold">Lost & Found Submissions</span>
              <div className="text-2xl font-black text-sky-600 mt-1">
                {analytics?.totalLostFound || lostFoundList.length}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {analytics?.pendingLostFound || 0} Pending Desk Review
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold">Feedback Received</span>
              <div className="text-2xl font-black text-teal-600 mt-1">
                {analytics?.totalFeedback || feedbackList.length}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Pilgrim Grievances & Suggestions</span>
            </div>
          </div>

          {/* Recharts Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution Bar Chart */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                Facility Category Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verification Status Distribution */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                Data Verification Status Breakdown
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verificationPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${percent !== undefined ? (percent * 100).toFixed(0) : ''}%`}
                    >
                      {verificationPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Facilities Management */}
      {adminSection === 'facilities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900">
              Manage Facilities Database
            </h2>
            <button
              onClick={() => {
                setEditingFacility(null);
                setFacForm({
                  nameEn: '',
                  nameTe: '',
                  nameHi: '',
                  category: 'drinking_water',
                  descEn: '',
                  descTe: '',
                  descHi: '',
                  locality: 'Rajahmundry',
                  address: '',
                  latitude: 17.002,
                  longitude: 81.775,
                  contactNumber: '',
                  verificationStatus: 'DEMO'
                });
                setShowFacilityModal(true);
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addFacility')}</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Facility Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Locality</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {facilitiesList.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{getLocalizedText(f.name, lang)}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{f.address}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px]">
                          {f.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{f.locality}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleVerifyFacility(f.id, f.verificationStatus)}
                          className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                            f.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {f.verificationStatus}
                        </button>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingFacility(f);
                            setFacForm({
                              nameEn: f.name.en,
                              nameTe: f.name.te,
                              nameHi: f.name.hi,
                              category: f.category,
                              descEn: f.description.en,
                              descTe: f.description.te,
                              descHi: f.description.hi,
                              locality: f.locality,
                              address: f.address,
                              latitude: f.latitude,
                              longitude: f.longitude,
                              contactNumber: f.contactNumber || '',
                              verificationStatus: f.verificationStatus
                            });
                            setShowFacilityModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFacility(f.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Announcements */}
      {adminSection === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900">
              Manage Live Announcements
            </h2>
            <button
              onClick={() => setShowAnnModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addAnnouncement')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcementsList.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded">
                    {a.priority} • {a.category}
                  </span>
                  <button
                    onClick={() => handleDeleteAnnouncement(a.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{getLocalizedText(a.title, lang)}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{getLocalizedText(a.description, lang)}</p>
                <div className="text-[10px] text-slate-400 flex justify-between pt-1">
                  <span>Source: {a.source}</span>
                  <span className="font-bold text-emerald-700">{a.verificationStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Lost and Found */}
      {adminSection === 'lostfound' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-base text-slate-900">
            Lost & Found Desk Inquiries (Admin Confidential View)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lostFoundList.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold bg-slate-100 px-2 py-0.5 rounded">
                    {r.type} • {r.itemCategory}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    r.status === 'VERIFIED_BY_DESK' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-900">{r.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{r.description}</p>
                </div>

                {/* Confidential Contact Details Visible Only to Admin */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-700">Confidential Claimant Information:</div>
                  <div className="text-slate-600">Name: <strong>{r.contactName}</strong></div>
                  <div className="text-slate-600">Phone: <strong className="font-mono text-teal-800">{r.contactInfo}</strong></div>
                  <div className="text-slate-500 text-[11px]">Location: {r.approxLocation}</div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateLfStatus(r.id, 'VERIFIED_BY_DESK')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-lg"
                  >
                    Verify for Public
                  </button>
                  <button
                    onClick={() => handleUpdateLfStatus(r.id, 'RESOLVED')}
                    className="flex-1 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold py-1.5 rounded-lg"
                  >
                    Mark Handed Over
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Feedback */}
      {adminSection === 'feedback' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-base text-slate-900">
            Pilgrim Feedback & Quality Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                    {fb.category}
                  </span>
                  <span className="text-xs font-bold text-amber-500">
                    {'★'.repeat(fb.rating || 5)}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "{fb.message}"
                </p>
                {fb.contactInfo && (
                  <div className="text-[11px] text-slate-400">
                    Contact: {fb.contactInfo}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 pt-1">
                  Received on: {fb.createdAt?.split('T')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facility Edit Modal */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">
                {editingFacility ? 'Edit Facility Record' : 'Create New Facility'}
              </h3>
              <button onClick={() => setShowFacilityModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFacility} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Facility Name (English) *</label>
                <input
                  type="text"
                  value={facForm.nameEn}
                  onChange={(e) => setFacForm({ ...facForm, nameEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Name (Telugu)</label>
                  <input
                    type="text"
                    value={facForm.nameTe}
                    onChange={(e) => setFacForm({ ...facForm, nameTe: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Name (Hindi)</label>
                  <input
                    type="text"
                    value={facForm.nameHi}
                    onChange={(e) => setFacForm({ ...facForm, nameHi: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={facForm.category}
                    onChange={(e) => setFacForm({ ...facForm, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="bathing_ghat">Bathing Ghat</option>
                    <option value="hospital">Hospital</option>
                    <option value="medical_camp">Medical Camp</option>
                    <option value="drinking_water">Drinking Water</option>
                    <option value="public_toilet">Public Toilet</option>
                    <option value="police_station">Police Station</option>
                    <option value="help_desk">Help Desk</option>
                    <option value="bus_stop">Bus Terminal</option>
                    <option value="parking_area">Parking Area</option>
                    <option value="food_assistance">Food Assistance</option>
                    <option value="accessibility_assistance">Accessibility Buggy</option>
                    <option value="lost_found_desk">Lost & Found Desk</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Locality *</label>
                  <input
                    type="text"
                    value={facForm.locality}
                    onChange={(e) => setFacForm({ ...facForm, locality: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Address *</label>
                <input
                  type="text"
                  value={facForm.address}
                  onChange={(e) => setFacForm({ ...facForm, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={facForm.latitude}
                    onChange={(e) => setFacForm({ ...facForm, latitude: parseFloat(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={facForm.longitude}
                    onChange={(e) => setFacForm({ ...facForm, longitude: parseFloat(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Verification Status</label>
                <select
                  value={facForm.verificationStatus}
                  onChange={(e) => setFacForm({ ...facForm, verificationStatus: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="DEMO">DEMO DATA — NOT OFFICIAL</option>
                  <option value="VERIFIED">VERIFIED (District Authorized)</option>
                  <option value="UNVERIFIED">UNVERIFIED</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl mt-2"
              >
                Save Facility Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Post Public Announcement</h3>
              <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title (English) *</label>
                <input
                  type="text"
                  value={annForm.titleEn}
                  onChange={(e) => setAnnForm({ ...annForm, titleEn: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description (English) *</label>
                <textarea
                  value={annForm.descEn}
                  onChange={(e) => setAnnForm({ ...annForm, descEn: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="safety_alert">Safety Alert</option>
                    <option value="route_advisory">Route Advisory</option>
                    <option value="medical_info">Medical Info</option>
                    <option value="transport_update">Transport Update</option>
                    <option value="facility_update">Facility Update</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={annForm.priority}
                    onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl mt-2"
              >
                Broadcast Announcement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
