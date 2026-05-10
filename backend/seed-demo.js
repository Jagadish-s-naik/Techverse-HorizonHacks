
import { query } from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const crops = [
  { name: 'potato', mandi: 'agra', district: 'agra', basePrice: 12 },
  { name: 'cotton', mandi: 'amravati', district: 'amravati', basePrice: 65 },
  { name: 'maize', mandi: 'gulabbagh', district: 'purnia', basePrice: 22 },
  { name: 'soybean', mandi: 'ujjain', district: 'ujjain', basePrice: 45 },
  { name: 'mustard', mandi: 'indore', district: 'indore', basePrice: 58 },
  { name: 'tomato', mandi: 'kolar', district: 'kolar', basePrice: 18 },
  { name: 'rice', mandi: 'vashi', district: 'mumbai', basePrice: 38 },
  { name: 'wheat', mandi: 'azadpur', district: 'delhi', basePrice: 26 },
  { name: 'onion', mandi: 'lasalgaon', district: 'nashik', basePrice: 14 }
];

async function seed() {
  console.log('🌱 Seeding demo data...');

  for (const crop of crops) {
    console.log(`Processing ${crop.name} in ${crop.mandi}...`);

    // 1. Seed Mandi Prices (30 days)
    const values = [];
    for (let i = 30; i >= 0; i--) {
      const trend = Math.sin(i / 5) * 2; // Create a smooth wave trend
      const noise = (Math.random() - 0.5) * 1.5;
      const price = (crop.basePrice + trend + noise).toFixed(2);
      values.push(`('${crop.name}', '${crop.mandi}', CURRENT_DATE - INTERVAL '${i} days', ${price})`);
    }

    await query(`
      INSERT INTO mandi_prices (crop, mandi, date, price) 
      VALUES ${values.join(',')}
      ON CONFLICT (crop, mandi, date) DO UPDATE SET price = EXCLUDED.price;
    `);

    // 2. Seed a Forecast
    const currentPrice = crop.basePrice;
    const forecastPriceLow = (currentPrice * 1.05).toFixed(2);
    const forecastPriceHigh = (currentPrice * 1.15).toFixed(2);
    const trend = Math.random() > 0.3 ? 'up' : 'stable';
    
    const drivers = [
      'Low local arrival in mandis',
      'Increased export demand',
      'Expected rainfall affecting harvest logistics',
      'Steady festive demand'
    ].sort(() => 0.5 - Math.random()).slice(0, 3);

    await query(`
      INSERT INTO forecasts (crop, mandi, forecast_date, price_low, price_high, trend, confidence, drivers)
      VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7)
      ON CONFLICT (crop, mandi, forecast_date) DO UPDATE SET 
        price_low = EXCLUDED.price_low,
        price_high = EXCLUDED.price_high,
        trend = EXCLUDED.trend,
        confidence = EXCLUDED.confidence,
        drivers = EXCLUDED.drivers;
    `, [crop.name, crop.mandi, forecastPriceLow, forecastPriceHigh, trend, 85, JSON.stringify(drivers)]);

    // 3. Seed some history for the track record
    for (let j = 7; j >= 1; j--) {
        const pLow = (crop.basePrice * (0.9 + Math.random() * 0.1)).toFixed(2);
        const pHigh = (crop.basePrice * (1.1 + Math.random() * 0.1)).toFixed(2);
        
        await query(`
            INSERT INTO forecasts (crop, mandi, forecast_date, price_low, price_high, trend, confidence, drivers)
            VALUES ($1, $2, CURRENT_DATE - INTERVAL '${j} days', $3, $4, 'up', 80, $5)
            ON CONFLICT (crop, mandi, forecast_date) DO NOTHING;
        `, [crop.name, crop.mandi, pLow, pHigh, JSON.stringify(['Market indicators'])]);
    }
  }

  console.log('📊 Recording actual prices for track record...');
  try {
    const { recordActuals } = await import('./src/services/forecastService.js');
    await recordActuals();
  } catch (err) {
    console.warn('⚠️ Could not run recordActuals (might be a build issue):', err.message);
  }

  console.log('✅ Demo data seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
