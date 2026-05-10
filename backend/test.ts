import dotenv from 'dotenv';
dotenv.config();
import { query } from './src/config/db.js';
import { runForecastPipeline } from './src/services/forecastService.js';

async function main() {
  console.log('Running forecast pipeline...');
  await runForecastPipeline();
  console.log('Pipeline finished.');
  
  console.log('Fetching onion forecasts:');
  const res = await query("SELECT * FROM forecasts WHERE crop = 'onion' ORDER BY id DESC LIMIT 5");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
main().catch(console.error);
