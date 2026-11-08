import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_FACILITIES, INITIAL_ANNOUNCEMENTS, INITIAL_FAQS, INITIAL_SAFETY_GUIDELINES } from './src/data/seedData';
import { searchKnowledgeBase, filterFacilities, getLocalizedText } from './src/utils/rules';
import type { Facility, Announcement, FAQ, SafetyGuideline, LostFoundReport, FeedbackItem, Language, VerificationStatus } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  facilities: Facility[];
  announcements: Announcement[];
  faqs: FAQ[];
  safetyGuidelines: SafetyGuideline[];
  lostFoundReports: LostFoundReport[];
  feedback: FeedbackItem[];
  adminTokens: Record<string, { username: string; expiresAt: number }>;
}

function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        facilities: parsed.facilities || INITIAL_FACILITIES,
        announcements: parsed.announcements || INITIAL_ANNOUNCEMENTS,
        faqs: parsed.faqs || INITIAL_FAQS,
        safetyGuidelines: parsed.safetyGuidelines || INITIAL_SAFETY_GUIDELINES,
        lostFoundReports: parsed.lostFoundReports || [],
        feedback: parsed.feedback || [],
        adminTokens: parsed.adminTokens || {}
      };
    } catch (err) {
      console.error('Error reading database.json, re-initializing from seeds:', err);
    }
  }

  const initialDb: DatabaseSchema = {
    facilities: INITIAL_FACILITIES,
    announcements: INITIAL_ANNOUNCEMENTS,
    faqs: INITIAL_FAQS,
    safetyGuidelines: INITIAL_SAFETY_GUIDELINES,
    lostFoundReports: [],
    feedback: [],
    adminTokens: {}
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database.json:', err);
  }
}

let db = loadDatabase();

// Admin Authentication Middleware
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Pushkaralu2027@Sahaaya';

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  const session = db.adminTokens[token];

  if (!session || session.expiresAt < Date.now()) {
    return res.status(403).json({ error: 'Forbidden: Session expired or invalid' });
  }

  next();
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Godavari Sahaaya',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Admin login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === 'admin' && (password === ADMIN_PASSWORD || password === 'admin123')) {
    const token = crypto.randomBytes(24).toString('hex');
    // Session valid for 24 hours
    db.adminTokens[token] = {
      username: 'admin',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
    saveDatabase(db);
    return res.json({
      success: true,
      token,
      user: { username: 'admin', role: 'ADMIN' }
    });
  }
  return res.status(401).json({ error: 'Invalid username or administrator passkey' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  const session = db.adminTokens[token];
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ authenticated: false });
  }
  return res.json({ authenticated: true, user: { username: session.username, role: 'ADMIN' } });
});

// Facilities API
app.get('/api/facilities', (req: Request, res: Response) => {
  const { query, category, locality, lang } = req.query;
  const filtered = filterFacilities(
    db.facilities,
    (query as string) || '',
    (category as string) || 'ALL',
    (locality as string) || 'ALL',
    ((lang as Language) || 'en')
  );
  res.json(filtered);
});

app.get('/api/facilities/:id', (req: Request, res: Response) => {
  const facility = db.facilities.find((f) => f.id === req.params.id);
  if (!facility) return res.status(404).json({ error: 'Facility not found' });
  res.json(facility);
});

app.post('/api/facilities', requireAdmin, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.category || !data.locality) {
    return res.status(400).json({ error: 'Name, category, and locality are required' });
  }

  const newFacility: Facility = {
    id: `fac-${Date.now()}`,
    name: typeof data.name === 'string' ? { en: data.name, te: data.name, hi: data.name } : data.name,
    category: data.category,
    description: typeof data.description === 'string' ? { en: data.description, te: data.description, hi: data.description } : (data.description || { en: '', te: '', hi: '' }),
    locality: data.locality,
    address: data.address || '',
    latitude: Number(data.latitude) || 17.000,
    longitude: Number(data.longitude) || 81.780,
    contactNumber: data.contactNumber,
    availabilityStatus: data.availabilityStatus || 'OPEN_24_7',
    verificationStatus: data.verificationStatus || 'UNVERIFIED',
    source: data.source || 'Admin Entry',
    isDemo: data.verificationStatus === 'DEMO' || data.isDemo === true,
    lastUpdated: new Date().toISOString().split('T')[0],
    accessibilityFeatures: data.accessibilityFeatures || []
  };

  db.facilities.unshift(newFacility);
  saveDatabase(db);
  res.status(201).json(newFacility);
});

app.put('/api/facilities/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.facilities.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Facility not found' });

  const updated: Facility = {
    ...db.facilities[index],
    ...req.body,
    id: db.facilities[index].id,
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  db.facilities[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

app.delete('/api/facilities/:id', requireAdmin, (req: Request, res: Response) => {
  db.facilities = db.facilities.filter((f) => f.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Facility removed' });
});

app.put('/api/facilities/:id/verify', requireAdmin, (req: Request, res: Response) => {
  const index = db.facilities.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Facility not found' });

  const { status, source } = req.body;
  if (status !== 'VERIFIED' && status !== 'UNVERIFIED' && status !== 'DEMO') {
    return res.status(400).json({ error: 'Invalid verification status' });
  }

  db.facilities[index].verificationStatus = status as VerificationStatus;
  db.facilities[index].isDemo = status === 'DEMO';
  if (source) db.facilities[index].source = source;
  db.facilities[index].lastUpdated = new Date().toISOString().split('T')[0];

  saveDatabase(db);
  res.json(db.facilities[index]);
});

// Announcements API
app.get('/api/announcements', (req: Request, res: Response) => {
  const { category, activeOnly } = req.query;
  let list = db.announcements;
  if (activeOnly === 'true') {
    list = list.filter((a) => a.isPublished);
  }
  if (category && category !== 'ALL') {
    list = list.filter((a) => a.category === category);
  }
  res.json(list);
});

app.post('/api/announcements', requireAdmin, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.title || !data.category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    title: typeof data.title === 'string' ? { en: data.title, te: data.title, hi: data.title } : data.title,
    description: typeof data.description === 'string' ? { en: data.description, te: data.description, hi: data.description } : (data.description || { en: '', te: '', hi: '' }),
    category: data.category,
    priority: data.priority || 'MEDIUM',
    publicationDate: new Date().toISOString().split('T')[0],
    expiryDate: data.expiryDate,
    source: data.source || 'Authorized Operations Desk',
    verificationStatus: data.verificationStatus || 'VERIFIED',
    isPublished: data.isPublished !== false,
    isDemo: data.verificationStatus === 'DEMO' || data.isDemo === true
  };

  db.announcements.unshift(newAnn);
  saveDatabase(db);
  res.status(201).json(newAnn);
});

app.put('/api/announcements/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.announcements.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Announcement not found' });

  db.announcements[index] = {
    ...db.announcements[index],
    ...req.body,
    id: db.announcements[index].id
  };
  saveDatabase(db);
  res.json(db.announcements[index]);
});

app.delete('/api/announcements/:id', requireAdmin, (req: Request, res: Response) => {
  db.announcements = db.announcements.filter((a) => a.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// FAQs API
app.get('/api/faqs', (req: Request, res: Response) => {
  const { query, category, lang } = req.query;
  let results = db.faqs;
  if (category && category !== 'ALL') {
    results = results.filter((f) => f.category === category);
  }
  if (query) {
    results = searchKnowledgeBase(results, query as string, (lang as Language) || 'en');
  }
  res.json(results);
});

app.post('/api/faqs', requireAdmin, (req: Request, res: Response) => {
  const data = req.body;
  const newFaq: FAQ = {
    id: `faq-${Date.now()}`,
    category: data.category || 'General',
    question: typeof data.question === 'string' ? { en: data.question, te: data.question, hi: data.question } : data.question,
    answer: typeof data.answer === 'string' ? { en: data.answer, te: data.answer, hi: data.answer } : data.answer,
    source: data.source || 'Official Pushkar Manual',
    verificationStatus: data.verificationStatus || 'VERIFIED',
    isDemo: data.verificationStatus === 'DEMO' || data.isDemo === true
  };
  db.faqs.unshift(newFaq);
  saveDatabase(db);
  res.status(201).json(newFaq);
});

app.put('/api/faqs/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.faqs.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'FAQ not found' });
  db.faqs[index] = { ...db.faqs[index], ...req.body, id: db.faqs[index].id };
  saveDatabase(db);
  res.json(db.faqs[index]);
});

app.delete('/api/faqs/:id', requireAdmin, (req: Request, res: Response) => {
  db.faqs = db.faqs.filter((f) => f.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Safety Guidelines API
app.get('/api/safety-guidelines', (_req: Request, res: Response) => {
  res.json(db.safetyGuidelines);
});

// Lost and Found API
app.get('/api/lost-found', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const isAdmin = authHeader && authHeader.startsWith('Bearer ') && db.adminTokens[authHeader.split(' ')[1]];

  if (isAdmin) {
    // Admin sees all details including private contact phone
    return res.json(db.lostFoundReports);
  }

  // Public sees only verified reports, masking private contact number for privacy protection
  const publicList = db.lostFoundReports
    .filter((r) => r.status === 'VERIFIED_BY_DESK' || r.status === 'RESOLVED')
    .map((r) => ({
      id: r.id,
      type: r.type,
      itemCategory: r.itemCategory,
      title: r.title,
      description: r.description,
      approxLocation: r.approxLocation,
      date: r.date,
      status: r.status,
      createdAt: r.createdAt
    }));

  res.json(publicList);
});

app.post('/api/lost-found', (req: Request, res: Response) => {
  const { type, itemCategory, title, description, approxLocation, date, contactName, contactInfo } = req.body;
  if (!type || !title || !description || !approxLocation || !contactName || !contactInfo) {
    return res.status(400).json({ error: 'All report fields are required to process inquiry' });
  }

  const report: LostFoundReport = {
    id: `lf-${Date.now()}`,
    type: type === 'FOUND' ? 'FOUND' : 'LOST',
    itemCategory: itemCategory || 'General Goods',
    title: title.trim(),
    description: description.trim(),
    approxLocation: approxLocation.trim(),
    date: date || new Date().toISOString().split('T')[0],
    contactName: contactName.trim(),
    contactInfo: contactInfo.trim(),
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString()
  };

  db.lostFoundReports.unshift(report);
  saveDatabase(db);
  res.status(201).json({
    success: true,
    message: 'Report filed successfully. Our desk will review and contact you privately.',
    reportId: report.id
  });
});

app.put('/api/lost-found/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.lostFoundReports.findIndex((r) => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Report not found' });

  db.lostFoundReports[index] = {
    ...db.lostFoundReports[index],
    ...req.body,
    id: db.lostFoundReports[index].id
  };
  saveDatabase(db);
  res.json(db.lostFoundReports[index]);
});

// Feedback API
app.post('/api/feedback', (req: Request, res: Response) => {
  const { category, message, contactInfo, rating } = req.body;
  if (!category || !message) {
    return res.status(400).json({ error: 'Category and feedback message are required' });
  }

  const item: FeedbackItem = {
    id: `fb-${Date.now()}`,
    category,
    message: message.trim(),
    contactInfo: contactInfo ? contactInfo.trim() : undefined,
    rating: Number(rating) || 5,
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  db.feedback.unshift(item);
  saveDatabase(db);
  res.status(201).json({
    success: true,
    message: 'Thank you! Your feedback helps us improve services for all pilgrims.'
  });
});

app.get('/api/feedback', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.feedback);
});

app.put('/api/feedback/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.feedback.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Feedback not found' });

  db.feedback[index].status = req.body.status || db.feedback[index].status;
  saveDatabase(db);
  res.json(db.feedback[index]);
});

// Analytics API for Admin Dashboard
app.get('/api/analytics', requireAdmin, (_req: Request, res: Response) => {
  const totalFacilities = db.facilities.length;
  const verifiedFacilities = db.facilities.filter((f) => f.verificationStatus === 'VERIFIED').length;
  const demoFacilities = db.facilities.filter((f) => f.verificationStatus === 'DEMO').length;
  const unverifiedFacilities = totalFacilities - verifiedFacilities - demoFacilities;

  const categoryCounts: Record<string, number> = {};
  for (const fac of db.facilities) {
    categoryCounts[fac.category] = (categoryCounts[fac.category] || 0) + 1;
  }

  const totalAnnouncements = db.announcements.length;
  const publishedAnnouncements = db.announcements.filter((a) => a.isPublished).length;
  const announcementCategoryCounts: Record<string, number> = {};
  for (const a of db.announcements) {
    announcementCategoryCounts[a.category] = (announcementCategoryCounts[a.category] || 0) + 1;
  }

  const totalFeedback = db.feedback.length;
  const feedbackStatusCounts: Record<string, number> = {};
  for (const f of db.feedback) {
    feedbackStatusCounts[f.category] = (feedbackStatusCounts[f.category] || 0) + 1;
  }

  const totalLostFound = db.lostFoundReports.length;
  const pendingLostFound = db.lostFoundReports.filter((r) => r.status === 'PENDING_REVIEW').length;

  res.json({
    totalFacilities,
    verifiedFacilities,
    unverifiedFacilities,
    demoFacilities,
    categoryCounts,
    totalAnnouncements,
    publishedAnnouncements,
    announcementCategoryCounts,
    totalFeedback,
    feedbackStatusCounts,
    totalLostFound,
    pendingLostFound,
    totalFaqs: db.faqs.length
  });
});

// Reset seed data
app.post('/api/admin/reset-seed', requireAdmin, (_req: Request, res: Response) => {
  db = {
    facilities: INITIAL_FACILITIES,
    announcements: INITIAL_ANNOUNCEMENTS,
    faqs: INITIAL_FAQS,
    safetyGuidelines: INITIAL_SAFETY_GUIDELINES,
    lostFoundReports: [],
    feedback: [],
    adminTokens: db.adminTokens
  };
  saveDatabase(db);
  res.json({ success: true, message: 'Database reset to standard Pushkaralu 2027 initial demo dataset.' });
});

// -------------------------------------------------------------
// AI ASSISTANT CHAT ROUTE (GEMINI + DETERMINISTIC KB FALLBACK)
// -------------------------------------------------------------
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, language = 'en', history = [] } = req.body;
  const lang = (['en', 'te', 'hi'].includes(language) ? language : 'en') as Language;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  // 1. Gather relevant knowledge from local database for grounded retrieval
  const matchedFaqs = searchKnowledgeBase(db.faqs, message, lang).slice(0, 4);
  const matchedFacilities = filterFacilities(db.facilities, message, 'ALL', 'ALL', lang).slice(0, 3);
  const activeAnnouncements = db.announcements.filter((a) => a.isPublished).slice(0, 4);

  // Build context summary
  const kbContext = `
APPROVED KNOWLEDGE BASE FOR GODAVARI PUSHKARALU 2027:
National Emergency Helpline: 112 (Police, Ambulance 108, Fire, SDRF)
Childline: 1098
Women Helpline: 181

Key Ghats in Rajahmundry:
- Pushkar Ghat: Main ceremonial ghat, illuminated 24/7, wheelchair ramps, barrier chains.
- Kotilingala Revu Ghat: Historical large capacity ghat, safety barricades, medical outpost.
- Saraswati Ghat: Peaceful family snanam ghat upstream.
- Goshpada Kshetram (Kovvur bank): Sacred footprint shrines and stone steps.

Matching FAQs:
${matchedFaqs.map((f, i) => `${i + 1}. Q: ${getLocalizedText(f.question, lang)}\n   A: ${getLocalizedText(f.answer, lang)} (Source: ${f.source}, Status: ${f.verificationStatus})`).join('\n')}

Matching Facilities:
${matchedFacilities.map((f, i) => `${i + 1}. ${getLocalizedText(f.name, lang)} (${f.category}) at ${f.locality}, ${f.address}. Status: ${f.availabilityStatus}. Verification: ${f.verificationStatus} (${f.isDemo ? 'DEMO DATA — NOT OFFICIAL' : 'Verified'})`).join('\n')}

Active Announcements:
${activeAnnouncements.map((a, i) => `${i + 1}. ${getLocalizedText(a.title, lang)}: ${getLocalizedText(a.description, lang)} [Priority: ${a.priority}, Status: ${a.verificationStatus}]`).join('\n')}
`;

  // Try Gemini AI if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are GODAVARI SAHAAYA, the smart multilingual AI companion for pilgrims attending Godavari Pushkaralu 2027.
The pilgrim is conversing in: ${lang === 'te' ? 'Telugu (తెలుగు)' : lang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}.
Strictly follow these rules:
1. Respond in the requested language (${lang === 'te' ? 'Telugu' : lang === 'hi' ? 'Hindi' : 'English'}).
2. Base factual claims strictly on the provided Approved Knowledge Base.
3. If information is not in the knowledge base, clearly state that it is not yet verified or officially available.
4. Never invent schedules, train timings, or personal contacts.
5. All synthetic test records must include: "DEMO DATA — NOT OFFICIAL".
6. Always mention India Emergency 112 / Ambulance 108 when health or safety is asked.
7. Keep answers empathetic, concise, and easy to read on mobile screens.

${kbContext}

User Question: ${message}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const reply = response.text || '';
      if (reply) {
        return res.json({
          reply,
          language: lang,
          sourceReference: matchedFaqs.length > 0 ? matchedFaqs[0].source : 'Godavari Pushkaralu Knowledge Base',
          verificationStatus: matchedFaqs.length > 0 ? matchedFaqs[0].verificationStatus : 'DEMO',
          isFallback: false
        });
      }
    } catch (err: unknown) {
      console.warn('Gemini API call failed or quota reached, falling back to local retrieval:', err);
    }
  }

  // 2. DETERMINISTIC RETRIEVAL FALLBACK (works 100% offline or with zero API keys/cost!)
  let fallbackReply = '';
  let sourceRef = 'Local Knowledge Base (Deterministic Fallback)';
  let verificationStatus: VerificationStatus = 'DEMO';

  if (matchedFaqs.length > 0) {
    const topFaq = matchedFaqs[0];
    sourceRef = topFaq.source;
    verificationStatus = topFaq.verificationStatus;
    const answer = getLocalizedText(topFaq.answer, lang);
    const related = matchedFaqs.slice(1, 3).map((f) => `• ${getLocalizedText(f.question, lang)}`).join('\n');

    if (lang === 'te') {
      fallbackReply = `${answer}\n\n[ఆధారం: ${sourceRef} (${topFaq.isDemo ? 'డెమో సమాచారం — అధికారికం కాదు' : 'ధృవీకరించబడింది'})]\n\nసంబంధిత ప్రశ్నలు:\n${related}\n\nఅత్యవసర సహాయం కోసం జాతీయ హెల్ప్‌లైన్ 112 కు కాల్ చేయండి.`;
    } else if (lang === 'hi') {
      fallbackReply = `${answer}\n\n[स्रोत: ${sourceRef} (${topFaq.isDemo ? 'डेमो डेटा — आधिकारिक नहीं' : 'सत्यापित'})]\n\nसंबंधित प्रश्न:\n${related}\n\nआपातकालीन सहायता के लिए राष्ट्रीय हेल्पलाइन 112 पर संपर्क करें।`;
    } else {
      fallbackReply = `${answer}\n\n[Source: ${sourceRef} (${topFaq.isDemo ? 'DEMO DATA — NOT OFFICIAL' : 'VERIFIED'})]\n\nRelated Topics:\n${related}\n\nFor urgent assistance, dial National Helpline 112 or Ambulance 108.`;
    }
  } else if (matchedFacilities.length > 0) {
    const fac = matchedFacilities[0];
    sourceRef = fac.source;
    verificationStatus = fac.verificationStatus;
    const facName = getLocalizedText(fac.name, lang);
    const facDesc = getLocalizedText(fac.description, lang);

    if (lang === 'te') {
      fallbackReply = `సమీప సదుపాయం కనుగొనబడింది:\n📍 **${facName}** (${fac.locality})\n${facDesc}\nచిరునామా: ${fac.address}\n\n[ఆధారం: ${sourceRef} (డెమో సమాచారం — అధికారికం కాదు)]`;
    } else if (lang === 'hi') {
      fallbackReply = `निकटतम सुविधा विवरण:\n📍 **${facName}** (${fac.locality})\n${facDesc}\nपता: ${fac.address}\n\n[स्रोत: ${sourceRef} (डेमो डेटा — आधिकारिक नहीं)]`;
    } else {
      fallbackReply = `Matching facility found:\n📍 **${facName}** (${fac.locality})\n${facDesc}\nAddress: ${fac.address}\n\n[Source: ${sourceRef} (DEMO DATA — NOT OFFICIAL)]`;
    }
  } else {
    if (lang === 'te') {
      fallbackReply = `ఈ ప్రశ్నకు నిర్దిష్ట సమాచారం మా నాలెడ్జ్ బేస్‌లో ఇంకా ధృవీకరించబడలేదు.\nదయచేసి పుష్కర్ ఘాట్ లేదా కోటిలింగాల వద్ద ఉన్న పోలీస్ హెల్ప్ డెస్క్‌ను సంప్రదించండి, లేదా అత్యవసర పరిస్థితుల్లో 112 కు కాల్ చేయండి.\n(గమనిక: డెమో మోడ్ లోకల్ ఫాల్‌బ్యాక్ సమాధానం)`;
    } else if (lang === 'hi') {
      fallbackReply = `इस प्रश्न के लिए विशिष्ट जानकारी हमारे ज्ञानकोष में अभी तक सत्यापित नहीं है।\nकृपया पुष्कर घाट या निकटतम पुलिस सहायता केंद्र से संपर्क करें, या आपात स्थिति में 112 डायल करें।\n(नोट: स्थानीय डेमो फॉलबैक उत्तर)`;
    } else {
      fallbackReply = `Specific verified details for your inquiry are currently not found in the approved knowledge base.\nPlease consult the nearest Pilgrim Help Desk at Pushkar Ghat or dial 112 for emergency guidance.\n(Note: Deterministic retrieval fallback active)`;
    }
  }

  return res.json({
    reply: fallbackReply,
    language: lang,
    sourceReference: sourceRef,
    verificationStatus,
    isFallback: true
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS HANDLER
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Godavari Sahaaya Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting Godavari Sahaaya server:', err);
  process.exit(1);
});
