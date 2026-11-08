# GODAVARI SAHAAYA (PS-04)
### Godavari Pushkaralu 2027 | AI-Powered Multilingual Pilgrim Assistance Platform

> **Tagline:** *Your Smart Companion for Godavari Pushkaralu 2027*  
> **Problem Statement:** PS-04  
> **Architecture:** Full-Stack (React 19 + TypeScript + Express + Leaflet + Recharts + Gemini API + PWA)  
> **Pricing:** 100% Free-First (Zero Paid APIs, Zero Cloud Subscriptions required)

---

## 🌊 Overview

**GODAVARI SAHAAYA** is an intelligent, multilingual digital companion designed to assist pilgrims attending **Godavari Pushkaralu 2027** across Rajamahendravaram (Rajahmundry) and Kovvur.

The platform provides verified facility discovery, interactive open-source mapping, live public announcements, confidential lost-and-found reunification, emergency safety guidance, and an AI-powered multilingual assistant powered by Google Gemini with a deterministic offline knowledge-base retrieval fallback.

---

## 🚀 Key Features

### 1. 🤖 AI Multilingual Pilgrim Assistant
- Natural language assistance in **Telugu (తెలుగు)**, **English**, and **Hindi (हिन्दी)**.
- Powered by `@google/genai` (Gemini 2.5 Flash) with server-side knowledge base grounding.
- **Deterministic Offline Fallback:** If Gemini API is unreachable, quota is exhausted, or no API key is provided, the platform automatically executes a local FAQ and facility search fallback, ensuring the assistant is always functional with zero cost.
- **Voice Input & Text-to-Speech:** Browser speech recognition and speech synthesis support.
- **Source Attribution:** Factual answers display source references and a transparent `DEMO DATA — NOT OFFICIAL` or `VERIFIED` indicator.

### 2. 🗺️ Smart Facility Finder & Interactive Maps
- Powered by **Leaflet** and **OpenStreetMap** (free, no paid billing or Google Maps API key required).
- Pinpoints all 12 essential facility categories:
  1. Bathing Ghats
  2. Hospitals
  3. Medical Camps (First Aid)
  4. Drinking Water Points (Free RO)
  5. Public Toilets & Bio-Toilets
  6. Police Stations & Help Desks
  7. Pilgrim Information Counters
  8. Shuttle Bus Terminals
  9. Vehicle Parking Zones (P1 to P4)
  10. Food Assistance (Annadanam)
  11. Accessibility Buggies & Ramps
  12. Lost & Found Reunification Centers
- Filter by category and locality (Rajahmundry, Kovvur).
- Distance calculation from pilgrim's current location (with browser permission).
- Directions link to open native navigation.

### 3. 🌊 Bathing Ghat Information
- Dedicated profiles for major sacred ghats: **Kotilingala Revu**, **Pushkar Ghat**, **Saraswati Ghat**, and **Goshpada Kshetram (Kovvur)**.
- Safe standing depth explanations, safety chain usage, changing rooms, and wheelchair ramp status.
- Crucial river safety and barricade protocols.

### 4. 🏥 24/7 Medical Assistance
- Emergency hospital and first-aid camp directory.
- Direct dial buttons for **108 Medical Ambulance** and **112 National Emergency**.
- Prominent clinical disclaimer clarifying that navigational aid is not a substitute for clinical diagnosis.

### 5. 🚌 Transit & Parking Infrastructure
- Free municipal green shuttle feeder routes connecting outer highway parking to bathing ghats.
- Satellite bus bays at Rajahmundry Railway Station (East & West gates).
- Route advisories and heavy vehicle diversions.

### 6. 📢 Public Announcements & Alerts
- Categorized announcements: Safety alerts, route advisories, medical updates, sanitation schedules, and festival information.
- Filter by priority: Critical, High, Medium, Low.

### 7. 🚨 Emergency Help & Protocols
- One-touch dialers for:
  - **112** (National Emergency Helpline: Police, Fire, Ambulance, SDRF)
  - **108** (Ambulance Helpline)
  - **1098** (Childline Protection)
  - **181** (Women Crisis Helpline)
- Step-by-step crisis guides for lost children, separated family members, heat exhaustion, and water distress.

### 8. 🔍 Lost and Found Assistance
- Confidential lost item and found item report submission.
- **Privacy Guaranteed:** Claimant contact phone numbers are never published publicly. Only authorized desk coordinators view private contact numbers during claim verification.

### 9. 📱 Offline Pilgrim Guide & PWA
- Progressive Web App (PWA) with Web App Manifest (`/manifest.json`) and service worker (`/sw.js`).
- Caches application shell, essential emergency helplines, river safety mandates, and top FAQs directly to the pilgrim's device.
- Operates reliably even in dense crowds with congested mobile data networks.

### 10. 🛡️ Admin Operational Command & Analytics
- Secure administrator authentication (`/admin`) with session bearer tokens.
- **Recharts Analytics:** Category distribution bar chart, data verification pie chart, and live counters.
- Full CRUD operations: Create, edit, delete, and verify facility records.
- Broadcast announcements and manage FAQ knowledge base.
- Review incoming pilgrim feedback and lost-and-found submissions.
- Reset seed button to restore baseline demo data at any time.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, React Router, Tailwind CSS v4, Lucide React Icons |
| **Backend** | Node.js, Express, TypeScript, REST API, Server-Side Validation |
| **Database** | Persistent JSON store (`data/database.json`) with atomic file writes (Ready for Firestore integration) |
| **Mapping** | Leaflet 1.9.4 & OpenStreetMap (Zero Cost) |
| **AI Companion** | Google Gemini API (`@google/genai`) + Deterministic Grounded Retrieval Fallback |
| **Analytics** | Recharts 2.x |
| **PWA** | Service Worker, Web App Manifest, Cache API |

---

## 🔑 Administrative Access

- **URL:** `/admin`
- **Default Username:** `admin`
- **Default Passkey:** `Pushkaralu2027@Sahaaya` or `admin123`
*(Configurable via `ADMIN_PASSWORD` in `.env`)*

---

## 📦 API Endpoints

- `GET /api/health` - Server health check
- `POST /api/auth/login` - Admin authentication
- `GET /api/auth/me` - Verify active session
- `GET /api/facilities` - List facilities with query, category, locality filters
- `POST /api/facilities` - Add new facility (Admin)
- `PUT /api/facilities/:id` - Update facility (Admin)
- `DELETE /api/facilities/:id` - Delete facility (Admin)
- `PUT /api/facilities/:id/verify` - Toggle verification status (Admin)
- `GET /api/announcements` - List active public announcements
- `POST /api/announcements` - Post announcement (Admin)
- `DELETE /api/announcements/:id` - Remove announcement (Admin)
- `GET /api/faqs` - Knowledge base search & retrieval
- `GET /api/safety-guidelines` - Vital pilgrim safety rules
- `GET /api/lost-found` - Public verified lost & found inquiries
- `POST /api/lost-found` - File confidential report
- `POST /api/feedback` - Submit pilgrim feedback
- `GET /api/analytics` - Aggregated metrics for admin dashboard
- `POST /api/ai/chat` - Gemini AI chat with grounded retrieval fallback
- `POST /api/admin/reset-seed` - Re-initialize database baseline

---

## 🔒 Security & Privacy Practices

1. **No Client-Exposed Keys:** Gemini API keys are maintained strictly server-side.
2. **Privacy Protection:** Personal telephone numbers in lost-and-found submissions are masked from public APIs.
3. **Transparent Data Tagging:** All demonstration planning records are labeled `DEMO DATA — NOT OFFICIAL` until officially authenticated by district administration.
4. **Resilient Offline Architecture:** Critical survival and emergency instructions remain accessible without cellular network coverage.
