# Product Requirements Document
# FarmSight — Crop Demand Forecasting Platform

**Version:** 1.0 (Hackathon MVP)  
**Last Updated:** May 2026  
**Status:** Draft

---

## 1. Problem Statement

Smallholder farmers in India lack reliable, actionable market information at the time they make crop planning and selling decisions. Existing digital forecasting tools fail across three dimensions:

- **Prediction Reliability:** Models trained on historical averages break down in volatile markets; farmers are given single-number forecasts with no uncertainty communicated
- **Trust:** Platforms are opaque, have no accountability when predictions fail, and cannot compete with social networks and local intermediaries farmers already trust
- **Practical Usability:** Interfaces assume digital literacy and data connectivity that most smallholder farmers do not have

The result: farmers default to intuition and neighbour behaviour, leading to herd planting, oversupply crashes, and income loss.

---

## 2. Product Vision

FarmSight converts raw market data into **personalized, plain-language decisions** — not dashboards. Every screen answers one question: *"What should I do?"* The farmer never has to interpret data; the platform does the thinking and the farmer makes the call.

---

## 3. Target Users

### Primary User: Smallholder Farmer
- Land holding: 1–5 acres
- Crops: 1–3 crops per season
- Digital literacy: Low to moderate
- Device: Entry-level Android smartphone
- Connectivity: Intermittent 2G/3G
- Language: Regional (Kannada, Hindi, Telugu, Marathi)

### Secondary User: FPO / Cooperative Operator
- Runs group sessions with farmers
- Needs a kiosk/projection mode
- Aggregates community planting signals for their district

---

## 4. Goals and Non-Goals

### Goals (MVP)
- Deliver a personalized 7–14 day price forecast as a confidence band, not a point estimate
- Provide one clear decision recommendation per forecast
- Display a track record of past forecast accuracy to build trust over time
- Surface community planting signals to prevent herd behaviour
- Work in offline/low-connectivity mode
- Support voice readout in local language

### Non-Goals (MVP)
- Training a custom ML model
- Live API integration with Agmarknet (seeded data for demo)
- Full insurance or risk-sharing backend
- Web dashboard or desktop interface
- OTP-based authentication

---

## 5. Features

### F1 — Farmer Onboarding
**Priority:** P0

A 5-question guided setup completed in under 2 minutes.

| Field | Input Type | Options |
|---|---|---|
| Primary crop | Dropdown | Tomato, Onion, Wheat, Rice, Chickpea, Mustard |
| Land size | Slider | 0.5 – 20 acres |
| Irrigation access | Toggle | Yes / No |
| Storage capacity | Toggle | Yes / No |
| Nearest mandi | Search | District-level list |
| Language | Dropdown | Kannada, Hindi, Telugu, Marathi, English |

- No email or phone number required at setup
- Stored locally; synced to backend on first connectivity
- Editable any time from profile screen

---

### F2 — Forecast Card
**Priority:** P0

The primary screen of the app. One card per crop showing:

- **Price band:** e.g., "₹18 – ₹24 / kg"
- **Confidence level:** e.g., "72% confident"
- **Horizon:** "Next 7 days"
- **Trend indicator:** Up / Down / Stable arrow
- **3 driver bullets** (plain language, generated via Claude API):
  - e.g., "Low arrivals at Kolar mandi → price support"
  - e.g., "Delayed monsoon in Nashik → supply likely to tighten"
  - e.g., "Government procurement active → floor holding"

Forecast is refreshed daily. Card shows timestamp of last update.

---

### F3 — Decision Recommendation
**Priority:** P0

One tap from the Forecast Card reveals:

- A single recommended action in bold: **"Hold — wait 5–7 days before selling"**
- Risk label: 🟢 Safe / 🟡 Moderate / 🔴 Risky
- 2-line rationale tied to the forecast drivers
- Alternative action if farmer cannot follow primary recommendation (e.g., "If you need cash now: sell at Market B instead of Market A")

Decision logic is rule-based (see Architecture doc), not ML-generated.

---

### F4 — Track Record View
**Priority:** P0

Accessible from the Forecast Card via "How accurate are we?" link.

Displays for the farmer's specific crop + nearest mandi:
- Last 20 forecasts vs actual prices
- Simple accuracy stat: "Correct within ±10% — 17 out of 20 times"
- Colour-coded rows: green (accurate), yellow (moderate miss), red (big miss)
- Honest label on big misses: "Unexpected policy change caused this miss"

This is the primary trust-building mechanism. Data is seeded for demo.

---

### F5 — Community Signal
**Priority:** P1

A single data point shown below the Forecast Card:

> *"23 farmers in your district plan to grow Tomato this season"*

- Sourced from onboarding data of registered farmers in the same district
- Accompanied by a plain-language implication: "High local supply expected — consider diversifying"
- Does not show individual farmer data; district-level aggregates only

---

### F6 — Voice Readout
**Priority:** P1

A speaker icon on the Forecast Card triggers TTS readout:

- Reads: price band + confidence + top driver + decision recommendation
- Uses device-native TTS engine (no external service)
- Language follows farmer's language preference set in onboarding
- Works offline on cached forecast

---

### F7 — Offline / Low-Data Mode
**Priority:** P1

When connectivity is unavailable:

- App displays last cached forecast with a "Last updated X hours ago" banner
- Switches automatically to a simplified SMS-style layout: plain text, no images, minimal UI
- Voice readout still works on cached data
- Any profile changes or feedback queued and synced on reconnect

---

### F8 — End-of-Season Summary
**Priority:** P2

Shown at the end of each crop season (triggered by date):

- Forecasts followed vs not followed
- Estimated price outcome of each decision
- Plain-language summary: "Following 3 of our recommendations this season, you likely earned ₹X more per quintal on average"
- Encourages return next season

---

## 6. User Flows

### First-Time Flow
```
App open → Language select → 5-question onboarding → Forecast Card
```

### Weekly Core Loop
```
App open → Forecast Card → "What do I do?" → Decision Recommendation
                        → "Can I trust this?" → Track Record
                        → "What are others doing?" → Community Signal
```

### At the Mandi (Offline)
```
App open → No connectivity detected → Offline mode → Cached SMS-style forecast → Voice readout
```

### End of Season
```
Season end date triggers → Summary screen → Income impact estimate → "Start next season"
```

---

## 7. Non-Functional Requirements

| Requirement | Target |
|---|---|
| App load time (cached) | < 2 seconds on 2G |
| Forecast refresh | Once daily, 6:00 AM local time |
| Offline availability | Last 7 days of forecasts cached |
| Language support | 5 languages at launch |
| Minimum Android version | Android 8.0 (API 26) |
| Accessibility | Voice readout for all primary screens |
| Data privacy | No PII collected; farmer ID is anonymous UUID |

---

## 8. Success Metrics

| Metric | Hackathon Demo Target | 3-Month Real Target |
|---|---|---|
| Onboarding completion rate | > 90% in demo | > 70% |
| Forecast card open rate | — | > 60% weekly |
| Decision recommendation tap rate | Demonstrated in demo | > 50% of forecast views |
| Track record views | Demonstrated in demo | > 30% of users weekly |
| Offline mode trigger | Demonstrated in demo | — |
| Forecast accuracy (±10%) | Seeded at 80% for demo | > 65% real |

---

## 9. Out of Scope (Future Roadmap)

- Live mandi price API integration
- Custom ML model training (LSTM / XGBoost on real data)
- Buyer matching and direct trade
- Insurance / forecast-backed risk-sharing scheme
- FPO kiosk mode
- WhatsApp integration for nudges
- Soil and input cost calculators

---

## 10. Dependencies

| Dependency | Owner | Risk |
|---|---|---|
| Seeded mandi price data | Team | Low — manual seed |
| Claude API access | Anthropic | Low — trial key sufficient |
| OpenWeatherMap API | External | Low — free tier |
| NewsAPI | External | Low — free tier |
| Twilio SMS (optional) | External | Medium — trial limits |
| React Native build | Team | Medium — setup time |
