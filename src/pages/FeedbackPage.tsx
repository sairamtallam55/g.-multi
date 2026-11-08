import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ThumbsUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FeedbackPage: React.FC = () => {
  const { t } = useApp();
  const [category, setCategory] = useState<
    'suggestion' | 'incorrect_info' | 'facility_feedback' | 'technical_issue' | 'general'
  >('suggestion');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide feedback message content.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message,
          contactInfo,
          rating
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit feedback.');
      }
    } catch {
      setError('Network error submitting feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-[#0a2540] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden text-center sm:text-left">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30">
            <MessageSquare className="w-3.5 h-3.5 text-teal-300" />
            <span>Community Voice & Quality</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('navFeedback')} — Godavari Sahaaya
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Report inaccurate information, suggest new amenities, or let municipal teams know about sanitation conditions.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm animate-in fade-in">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <ThumbsUp className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">
            Thank You for Your Feedback!
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your valuable input has been logged and routed to our administrative review desk to enhance facilities for all pilgrims attending Godavari Pushkaralu 2027.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage('');
              setContactInfo('');
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs"
          >
            Submit Another Response
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
              >
                <option value="suggestion">General Suggestion</option>
                <option value="incorrect_info">Report Incorrect Information or Map Position</option>
                <option value="facility_feedback">Cleanliness or Facility Condition</option>
                <option value="technical_issue">App Glitch or Bug</option>
                <option value="general">Other Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-500 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Feedback / Observations *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Describe your observations, location name, or suggested improvements in detail..."
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optional Contact Info (Mobile or Email)
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Optional: in case our desk needs further clarification"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>We never share your contact information with commercial third parties or advertisers.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Feedback...' : 'Send Feedback'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
