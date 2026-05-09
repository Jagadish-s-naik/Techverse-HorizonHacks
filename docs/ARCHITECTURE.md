# Architecture Document
# FarmSight — Crop Demand Forecasting Platform

**Version:** 1.0 (Hackathon MVP)  
**Last Updated:** May 2026

---

## 1. System Overview

FarmSight is a mobile-first platform that delivers personalized crop price forecasts and decision recommendations to smallholder farmers. The architecture is designed for:

- **Low-connectivity resilience** — offline-first mobile app with aggressive caching
- **Hackathon buildability** — no custom ML training; uses rule engine + LLM API
- **Honesty over precision** — probabilistic bands, not fake point predictions

```
┌─────────────────────────────────────────────────────┐
│                  Farmer Device                      │
│         React Native App (Android/iOS)              │
│    Offline Cache │ TTS Engine │ SMS-style Fallback  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS REST
┌──────────────────────▼──────────────────────────────┐
│                  API Gateway                        │
│              (Railway / Render)                     │
└──────┬───────────────┬───────────────┬──────────────┘
       │               │               │
┌──────▼──────┐ ┌──────▼──────┐ ┌─────▼───────────────┐
│   Farmer    │ │  Forecast   │ │   Community Signal  │
│  Profile    │ │   Engine    │ │      Service        │
│  Service   │ │             │ │                     │
└──────┬──────┘ └──────┬──────┘ └─────────────────────┘
       │               │
┌──────▼───────────────▼──────────────────────────────┐
│                  Data Layer                         │
│    PostgreSQL (Supabase)  │  Redis Cache            │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              External Services                      │
│  Agmarknet (seeded) │ OpenWeatherMap │ NewsAPI      │
│  Claude API         │ Twilio SMS                   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Frontend

### Technology
- **Framework:** React Native (Expo managed workflow)
- **State Management:** Zustand (lightweight, no Redux boilerplate)
- **Offline Storage:** AsyncStorage + SQLite via expo-sqlite
- **Navigation:** React Navigation v6
- **Voice/TTS:** expo-speech (wraps device-native TTS, no external API)
- **HTTP Client:** Axios with offline queue via react-native-queue

### Key Design Decisions

**Offline-First Architecture**
Every API response is written to local SQLite immediately. On app open, the cached data renders instantly while a background sync runs. If sync fails, the user sees cached data with a timestamp banner — never a blank screen or error.

```
App Open
  ↓
Load from SQLite (instant)
  ↓
Render cached forecast
  ↓ (background)
Call API
  ↓
Update SQLite + re-render if changed
```

**SMS-Style Fallback Layout**
A separate React Native component tree renders when `isOffline && lastSyncAge > 4h`. It strips all images, animations, and colour coding — pure text layout legible on any screen size and brightness.

**TTS Implementation**
```javascript
import * as Speech from 'expo-speech';

const readForecast = (forecast, language) => {
  const script = buildScript(forecast, language); // templates per language
  Speech.speak(script, {
    language: languageCodeMap[language], // e.g., 'kn-IN' for Kannada
    rate: 0.85,
    pitch: 1.0,
  });
};
```

### Screen Map
```
App
├── Onboarding (first launch only)
│   └── 5-step guided form
├── Home
│   └── Forecast Card (primary screen)
│       ├── Decision Recommendation (bottom sheet)
│       ├── Track Record (modal)
│       └── Community Signal (inline below card)
├── Profile
│   └── Edit onboarding fields
└── Season Summary (date-triggered)
```

---

## 3. Backend

### Technology
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Language:** TypeScript
- **Hosting:** Railway (free tier — 512MB RAM, sufficient for demo)
- **Process Manager:** Built into Railway

### Services

#### 3.1 Farmer Profile Service
Manages anonymous farmer profiles.

```
POST   /api/farmers          → Create profile, return UUID
GET    /api/farmers/:id      → Fetch profile
PATCH  /api/farmers/:id      → Update profile fields
```

Farmer ID is a UUID generated on device at first launch. No PII stored. Profile stored locally and synced to backend.

#### 3.2 Forecast Engine
The core service. Runs once daily at 6:00 AM via a cron job.

**Pipeline:**
```
1. Fetch latest seeded mandi prices for all crop/district pairs
2. Compute 7-day moving average and 14-day moving average
3. Calculate price band: MA ± 15% adjusted by volatility score
4. Determine confidence level based on recent forecast accuracy
5. Fetch weather summary from OpenWeatherMap for each district
6. Fetch 3 crop-related news headlines from NewsAPI
7. Call Claude API to generate 3 plain-language driver bullets
8. Apply rule engine to generate decision recommendation
9. Write results to PostgreSQL
10. Invalidate Redis cache for affected crop/district pairs
```

```
GET  /api/forecasts?crop=tomato&mandi=kolar   → Latest forecast card
GET  /api/forecasts/history?crop=tomato&mandi=kolar&limit=20 → Track record
```

#### 3.3 Community Signal Service
Aggregates planting intentions from farmer profiles.

```
GET  /api/community?crop=tomato&district=kolar  → Count + implication text
```

Runs as a simple COUNT query on the farmers table, grouped by district and intended crop. No individual data exposed.

---

## 4. AI / ML Layer

### Philosophy
No custom model training. The hackathon AI layer has two components: a **deterministic rule engine** for decisions, and the **Claude API** for language generation. This is faster to build, easier to explain to judges, and more honest about uncertainty than a poorly-trained model.

### 4.1 Price Forecasting (Rule-Based)

```typescript
interface ForecastInput {
  prices: number[];        // last 30 days of daily prices
  crop: string;
  mandi: string;
}

function computeForecast(input: ForecastInput): ForecastOutput {
  const ma7  = movingAverage(input.prices, 7);
  const ma14 = movingAverage(input.prices, 14);
  const volatility = standardDeviation(input.prices.slice(-14));
  
  const trend = ma7 > ma14 ? 'up' : ma7 < ma14 ? 'down' : 'stable';
  const band  = {
    low:  Math.round(ma7 * 0.87),
    high: Math.round(ma7 * 1.13),
  };
  
  // Confidence degrades with higher volatility
  const confidence = Math.max(45, Math.round(80 - (volatility / ma7) * 100));
  
  return { trend, band, confidence };
}
```

### 4.2 Decision Recommendation (Rule Engine)

```typescript
function getRecommendation(forecast: ForecastOutput, farmer: FarmerProfile): Recommendation {
  const { trend, confidence } = forecast;
  const { hasStorage, cashNeeded } = farmer;

  if (trend === 'up' && confidence > 60 && hasStorage) {
    return { action: 'Hold — wait 5–7 days before selling', risk: 'moderate' };
  }
  if (trend === 'down' || !hasStorage || cashNeeded) {
    return { action: 'Sell now at current price', risk: 'safe' };
  }
  if (trend === 'up' && confidence < 60) {
    return { action: 'Sell 50% now, hold 50%', risk: 'moderate' };
  }
  return { action: 'Monitor daily — market unclear', risk: 'risky' };
}
```

### 4.3 Driver Bullet Generation (Claude API)

Called once per crop/district/day during the daily forecast pipeline — not on every user request.

```typescript
async function generateDriverBullets(context: DriverContext): Promise<string[]> {
  const prompt = `
    You are an agricultural market analyst explaining price movements to farmers.
    
    Data:
    - Crop: ${context.crop}
    - Region: ${context.district}, India
    - Current price trend: ${context.trend}
    - 7-day average price: ₹${context.ma7}/kg
    - Weather: ${context.weatherSummary}
    - News: ${context.headlines.join('; ')}
    
    Generate exactly 3 bullet points explaining WHY prices are likely to move this way.
    Each bullet must:
    - Be one sentence, under 15 words
    - Start with the cause, end with the price effect
    - Use plain language a farmer would understand
    - Be in ${context.language}
    
    Return only a JSON array of 3 strings. No preamble.
  `;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });

  return JSON.parse(response.content[0].text);
}
```

---

## 5. Data Layer

### PostgreSQL Schema (Supabase)

```sql
-- Anonymous farmer profiles
CREATE TABLE farmers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop          VARCHAR(50) NOT NULL,
  land_acres    DECIMAL(5,2),
  has_irrigation BOOLEAN DEFAULT false,
  has_storage   BOOLEAN DEFAULT false,
  mandi         VARCHAR(100) NOT NULL,
  district      VARCHAR(100) NOT NULL,
  language      VARCHAR(20) DEFAULT 'hindi',
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Seeded mandi price data
CREATE TABLE mandi_prices (
  id       SERIAL PRIMARY KEY,
  crop     VARCHAR(50) NOT NULL,
  mandi    VARCHAR(100) NOT NULL,
  date     DATE NOT NULL,
  price    DECIMAL(8,2) NOT NULL,
  UNIQUE(crop, mandi, date)
);

-- Daily computed forecasts
CREATE TABLE forecasts (
  id            SERIAL PRIMARY KEY,
  crop          VARCHAR(50) NOT NULL,
  mandi         VARCHAR(100) NOT NULL,
  forecast_date DATE NOT NULL,
  price_low     DECIMAL(8,2),
  price_high    DECIMAL(8,2),
  trend         VARCHAR(10),
  confidence    INTEGER,
  drivers       JSONB,           -- array of 3 bullet strings
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(crop, mandi, forecast_date)
);

-- Track record: actuals vs forecasts
CREATE TABLE forecast_actuals (
  forecast_id   INTEGER REFERENCES forecasts(id),
  actual_price  DECIMAL(8,2),
  recorded_at   TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(forecast_id)
);
```

### Redis Cache
- Key pattern: `forecast:{crop}:{mandi}` → JSON of latest forecast card
- TTL: 24 hours (refreshed by daily pipeline)
- Purpose: Eliminates DB query on every app open

### Data Seeding Strategy (Hackathon)
Manually seed 3 crops × 3 mandis × 90 days of historical prices. Source: Agmarknet website (copy-paste into CSV, import via script). This is enough to demonstrate moving averages, track record, and forecast generation.

```
Crops:  Tomato, Onion, Chickpea
Mandis: Kolar (Karnataka), Lasalgaon (Maharashtra), Indore (MP)
Days:   90 days historical + generate 20 days of "past forecasts" for track record demo
```

---

## 6. External Services

| Service | Purpose | Tier | Call Frequency |
|---|---|---|---|
| OpenWeatherMap | Weather summary per district | Free (1000 calls/day) | Once daily per district |
| NewsAPI | Crop-related headlines | Free (100 calls/day) | Once daily per crop |
| Claude API (Anthropic) | Driver bullet generation | Pay-per-use (~$0.01/call) | Once daily per crop/mandi pair |
| Twilio | SMS forecast delivery (optional) | Trial | On-demand |
| Agmarknet | Price data source | Free (seeded manually) | Manual seed only |

**Total estimated API cost for hackathon demo: < $5**

---

## 7. Deployment

### Services Map
```
Frontend:  Expo Go (demo) → EAS Build (APK for judges)
Backend:   Railway (free tier)
Database:  Supabase (free tier — 500MB, 2 concurrent connections)
Cache:     Upstash Redis (free tier — 10,000 commands/day)
Cron:      Railway cron job (daily forecast pipeline)
```

### Environment Variables
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ANTHROPIC_API_KEY=sk-ant-...
OPENWEATHER_API_KEY=...
NEWS_API_KEY=...
TWILIO_SID=...          # optional
TWILIO_TOKEN=...        # optional
```

### CI/CD (Minimal)
- Push to `main` → Railway auto-deploys backend
- Expo Go QR code for frontend demo (no build needed)

---

## 8. Security Considerations (MVP)

- No PII collected — farmer ID is UUID only
- API keys in environment variables, never in client code
- HTTPS enforced on all endpoints (Railway default)
- Rate limiting: 60 requests/minute per IP (express-rate-limit)
- No authentication required for MVP — farmer UUID passed as header

---

## 9. Scalability Path (Post-Hackathon)

| Component | MVP | Scale-Up |
|---|---|---|
| Price forecasting | Moving average + rules | LSTM / XGBoost trained on real Agmarknet data |
| Driver generation | Claude API (daily batch) | Fine-tuned smaller model, cheaper per call |
| Price data | Manually seeded | Live Agmarknet scraper or Data.gov.in API |
| SMS delivery | Twilio trial | Bulk SMS gateway (MSG91, TextLocal for India) |
| Hosting | Railway free tier | AWS Fargate + RDS |
| Caching | Upstash Redis | ElastiCache |
| Auth | UUID header | Aadhaar-linked mobile OTP |

---

## 10. Build Timeline (2-Day Hackathon)

### Day 1
| Time | Task | Owner |
|---|---|---|
| 0–2h | Supabase setup + schema + seed data import | Backend |
| 0–2h | React Native project init + navigation setup | Frontend |
| 2–5h | Forecast engine + Claude API integration | Backend |
| 2–5h | Onboarding screen + Farmer Profile service | Full-stack |
| 5–8h | Forecast Card UI + API integration | Frontend |
| 5–8h | REST endpoints for forecast + community signal | Backend |

### Day 2
| Time | Task | Owner |
|---|---|---|
| 0–3h | Decision Recommendation sheet + Track Record modal | Frontend |
| 0–3h | Redis caching + daily cron job | Backend |
| 3–5h | Offline mode + SQLite caching | Frontend |
| 3–5h | Community Signal service + SMS stub | Backend |
| 5–7h | Voice readout + SMS-style layout | Frontend |
| 7–8h | End-to-end demo run + bug fixes | All |
