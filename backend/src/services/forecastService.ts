import { query } from '../config/db.js';
import { generateDriverBullets, type DriverContext } from '../utils/ai.js';
import { getWeatherSummary } from './weatherService.js';
import { getHeadlines } from './newsService.js';
import { fetchLiveMandiPrices } from './mandiService.js';

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

export async function processTarget(cropInput: string, mandiInput: string) {
  const crop = cropInput.toLowerCase();
  const mandi = mandiInput.toLowerCase();

  // Fetch actual live price from API
  console.log(`Fetching live prices for ${crop} in ${mandi}...`);
  const livePrices = await fetchLiveMandiPrices(crop, mandi);
  console.log(`Live prices fetched: ${livePrices.length} records found.`);
  const todayPrice = livePrices.length > 0 ? livePrices[0]?.price : null;

  if (todayPrice) {
    console.log(`Saving today's live price: ${todayPrice} for ${crop} in ${mandi}`);
    // Save today's live price
    await query(
      `INSERT INTO mandi_prices (crop, mandi, date, price) 
       VALUES ($1, $2, CURRENT_DATE, $3)
       ON CONFLICT (crop, mandi, date) DO UPDATE SET price = EXCLUDED.price`,
      [crop, mandi, todayPrice]
    );
  }

  // 2. Get last 30 days of prices
  let priceData = await query(
    'SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 ORDER BY date DESC LIMIT 30',
    [crop, mandi]
  );
  
  // Removed auto-backfill logic to ensure only real data is used.
  
  const prices = priceData.rows.map((r: any) => Number(r.price)).reverse();
  console.log(`Historical price records found in DB: ${prices.length}`);

  if (prices.length < 7) {
    console.warn(`Insufficient data for ${crop} in ${mandi}: only ${prices.length} records found.`);
    throw new Error(`Insufficient real historical data for ${crop} in ${mandi}. Need at least 7 days of prices to forecast.`);
  }

  const forecast = computeForecast(prices);
  
  // 3. Fetch external data from APIs
  const weatherSummary = await getWeatherSummary(mandi);
  const headlines = await getHeadlines(crop);
  
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
  
  // 5. Save to DB and return the inserted forecast
  const result = await query(
    `INSERT INTO forecasts (crop, mandi, forecast_date, price_low, price_high, trend, confidence, drivers)
     VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7)
     ON CONFLICT (crop, mandi, forecast_date) DO UPDATE SET
     price_low = EXCLUDED.price_low,
     price_high = EXCLUDED.price_high,
     trend = EXCLUDED.trend,
     confidence = EXCLUDED.confidence,
     drivers = EXCLUDED.drivers
     RETURNING *`,
    [crop, mandi, forecast.band.low, forecast.band.high, forecast.trend, forecast.confidence, JSON.stringify(drivers)]
  );

  return result.rows[0];
}

export async function runForecastPipeline() {
  // 1. Fetch latest crops/mandis from both mandi_prices and farmers
  const targets = await query(`
    SELECT crop, mandi FROM mandi_prices
    UNION
    SELECT crop, mandi FROM farmers
  `);
  
  for (const target of targets.rows) {
    const { crop, mandi } = target;
    try {
      await processTarget(crop.toLowerCase(), mandi.toLowerCase());
    } catch (e) {
      console.error(`Error processing pipeline for ${crop} in ${mandi}:`, e);
    }
  }
}

export async function recordActuals() {
  // 1. Get all forecasts from yesterday that don't have an actual price yet
  const pending = await query(
    `SELECT f.id, f.crop, f.mandi, f.forecast_date 
     FROM forecasts f
     LEFT JOIN forecast_actuals fa ON f.id = fa.forecast_id
     WHERE fa.forecast_id IS NULL AND f.forecast_date < CURRENT_DATE`
  );

  for (const forecast of pending.rows) {
    // 2. Check if we have the actual price for that date in mandi_prices
    const actual = await query(
      'SELECT price FROM mandi_prices WHERE crop = $1 AND mandi = $2 AND date = $3',
      [forecast.crop, forecast.mandi, forecast.forecast_date]
    );

    if (actual.rows.length > 0) {
      // 3. Record the actual price
      await query(
        'INSERT INTO forecast_actuals (forecast_id, actual_price) VALUES ($1, $2)',
        [forecast.id, actual.rows[0].price]
      );
    }
  }
}
