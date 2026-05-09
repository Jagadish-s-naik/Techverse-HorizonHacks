import { query } from '../config/db.js';
import { generateDriverBullets, type DriverContext } from '../utils/ai.js';

export interface ForecastInput {
  prices: number[];
  crop: string;
  mandi: string;
}

export interface ForecastOutput {
  trend: 'up' | 'down' | 'stable';
  band: { low: number; high: number };
  confidence: number;
}

export function computeForecast(prices: number[]): ForecastOutput {
  const ma7 = prices.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const ma14 = prices.slice(-14).reduce((a, b) => a + b, 0) / 14;
  
  const mean = prices.slice(-14).reduce((a, b) => a + b, 0) / 14;
  const variance = prices.slice(-14).reduce((a, b) => a + (b - mean) ** 2, 0) / 14;
  const volatility = Math.sqrt(variance);
  
  const trend = ma7 > ma14 * 1.02 ? 'up' : ma7 < ma14 * 0.98 ? 'down' : 'stable';
  const band = {
    low: Math.round(ma7 * 0.87),
    high: Math.round(ma7 * 1.13),
  };
  
  const confidence = Math.max(45, Math.min(95, Math.round(80 - (volatility / ma7) * 100)));
  
  return { trend, band, confidence };
}

export async function runForecastPipeline() {
  // 1. Fetch latest crops/mandis
  const targets = await query('SELECT DISTINCT crop, mandi FROM mandi_prices');
  
  for (const target of targets.rows) {
    const { crop, mandi } = target;
    
    // 2. Get last 30 days of prices
    const priceData = await query(
      'SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 30',
      [crop, mandi]
    );
    
    if (priceData.rows.length < 14) continue;
    
    const prices = priceData.rows.map((r: any) => Number(r.price)).reverse();
    const forecast = computeForecast(prices);
    
    // 3. Mock external data for MVP
    const weatherSummary = "Scattered rainfall expected in the coming week";
    const headlines = ["Increased arrivals in local mandis", "Fuel price hike impacts transport"];
    
    // 4. Generate AI drivers
    const drivers = await generateDriverBullets({
      crop,
      district: mandi, // Using mandi as district proxy for MVP
      trend: forecast.trend,
      ma7: prices[prices.length - 1] ?? 0,
      weatherSummary,
      headlines,
      language: 'English'
    });
    
    // 5. Save to DB
    await query(
      `INSERT INTO forecasts (crop, mandi, forecast_date, price_low, price_high, trend, confidence, drivers)
       VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7)
       ON CONFLICT (crop, mandi, forecast_date) DO UPDATE SET
       price_low = EXCLUDED.price_low,
       price_high = EXCLUDED.price_high,
       trend = EXCLUDED.trend,
       confidence = EXCLUDED.confidence,
       drivers = EXCLUDED.drivers`,
      [crop, mandi, forecast.band.low, forecast.band.high, forecast.trend, forecast.confidence, JSON.stringify(drivers)]
    );
  }
}
