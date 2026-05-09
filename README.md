# FarmSight — Agri-Intelligence for the Last Mile 🌾

**FarmSight** is a mobile-first, offline-ready crop demand forecasting platform designed to empower smallholder farmers with actionable market intelligence. Built during the Techverse HorizonHacks, it bridges the gap between complex market data and on-ground agricultural decisions.

---

## 🚀 The Vision
Smallholder farmers often lack access to reliable market trends, leading to distress sales or poor crop choices. **FarmSight** delivers personalized price forecasts, confidence-scored trends, and AI-driven market explanations directly to the farmer's pocket, even without a stable internet connection.

---

## ✨ Key Features

### 📡 Resilience & Accessibility
- **Offline-First Architecture:** Aggressive caching via SQLite ensures the app works perfectly in low-connectivity zones.
- **SMS-Style Layout:** A minimalist, text-only fallback UI legibile on any screen size and high-contrast environments.
- **Multi-language Voice Readout:** High-quality TTS support for **English, Hindi, Kannada, Marathi, and Telugu**.

### 📈 Smart Insights
- **Price Band Forecasting:** Probabilistic price ranges (High/Low) rather than simple point predictions.
- **AI Drivers:** Plain-language explanations of WHY prices are moving (Weather, News, Logistics) powered by Claude API.
- **Decision Recommendations:** Personalized "Hold" vs "Sell" advice based on the farmer's storage capacity and price trends.
- **Community Signals:** Aggregated local planting intentions to help farmers avoid market gluts.

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **Framework:** React Native / Expo (TypeScript)
- **State:** Zustand with Persistence
- **Storage:** SQLite (expo-sqlite) + AsyncStorage
- **UI:** Lucide Icons + Custom Premium Design System
- **Accessibility:** Expo Speech (Multi-language TTS)

### Backend (Infrastructure)
- **Runtime:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Supabase)
- **Cache:** Redis (Upstash)
- **AI/ML:** Claude API (Anthropic) for Market Drivers
- **Data:** Rule-based Forecast Engine + Historical Agmarknet data

---

## 🏗️ Architecture Overview
FarmSight uses a "Stale-While-Revalidate" pattern. Local data is served instantly while a background process syncs with the backend. Market drivers are pre-computed daily to minimize latency and API costs.

---

## 🛠️ Setup & Installation

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on `.env.example`.
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npx expo start`
4. Use Expo Go on your mobile device to scan the QR code.

---

## 📅 Roadmap
- [ ] Live Agmarknet API scraping integration.
- [ ] Real SMS delivery fallback via Twilio/MSG91.
- [ ] ML-based long-term forecasting (LSTM).
- [ ] FPO (Farmer Producer Organization) Kiosk mode.

---

**Developed for Techverse HorizonHacks 2026**