# FarmSight API Documentation & Data Flow

## Overview
FarmSight has been fully transitioned from mock data generation to an authentic real-time data pipeline. The backend now interfaces exclusively with real-world APIs to fetch live mandi prices, localized weather data, and crop-specific news to power the AI forecasting engine. 

## External APIs Used

### 1. Mandi Prices (Govt. of India API)
- **Source:** data.gov.in
- **Purpose:** Fetches authentic daily agricultural market prices for specific crops and mandis.
- **Integration:** The `fetchLiveMandiPrices` service queries the dataset `9ef84268-d588-465a-a308-a864a43d0070`.
- **Usage:** Whenever a forecast is requested, the system retrieves today's price and records it in the database. Historical data (used for ML forecasting and chart rendering) relies strictly on what has been recorded in the database, avoiding any synthetic backfilling.

### 2. Groq AI (Llama 3.3 70B)
- **Source:** groq.com
- **Purpose:** Generates personalized, localized driver bullets and actionable recommendations for farmers.
- **Integration:** The `generateDriverBullets` utility provides contextual information (weather, news, technical trend) to the Llama model, which synthesizes actionable insights in the farmer's native language. 
- **Transition:** Replaced the Anthropic API to leverage Groq's high-speed inference.

### 3. Weather API
- **Source:** weatherapi.com
- **Purpose:** Retrieves real-time weather conditions for the specified mandi/district.
- **Integration:** The `getWeatherSummary` service fetches data like temperature, precipitation, and general conditions, which heavily influence short-term crop quality and supply logistics.

### 4. News API
- **Source:** newsapi.org
- **Purpose:** Pulls latest headlines related to specific crops.
- **Integration:** The `getHeadlines` service searches for crop-specific news (e.g., policy changes, export bans, regional yields) to provide macroeconomic context to the AI model.

## Data Seeding & Demo Requirements
Because the platform now strictly enforces the use of real data, forecasting combinations (Crop + Mandi) without at least 7–14 days of historical data will return a `404 Not Found` or error, rather than hallucinating prices.

For a successful demonstration, historical price data **must** be explicitly seeded in the database. 
The current UI supports the following crops and mandis:
- **Crops:** Tomato, Onion, Chickpea, Wheat, Rice, Mustard
- **Mandis:** Kolar, Lasalgaon, Indore, Azadpur, Vashi

**Seeded Combinations:**
To ensure the demo works flawlessly, the `seed.sql` script is populated with 30 days of historical baseline data for all combinations expected in the frontend. Once the platform is running, it will append real daily prices to these histories via the `data.gov.in` API.

## API Endpoints (Backend)
- `GET /api/forecast/latest?crop={crop}&mandi={mandi}&farmerId={id}`: Retrieves the latest forecast. Generates one on the fly (fetching live data) if not cached.
- `GET /api/forecast/history?crop={crop}&mandi={mandi}`: Retrieves the historical forecast tracking data.
- `GET /api/farmer/:id`: Retrieves farmer profile.
