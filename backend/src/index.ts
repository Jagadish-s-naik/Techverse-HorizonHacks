import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import farmerRoutes from './routes/farmerRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import smsRoutes from './routes/smsRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import translateRoutes from './routes/translateRoutes.js';

import cron from 'node-cron';
import { runForecastPipeline, recordActuals } from './services/forecastService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// LOUD LOGGER - MUST BE FIRST
app.use((req, res, next) => {
  const { method, url, query, body } = req;
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] 📥 REQUEST: ${method} ${url}`);
  if (Object.keys(query).length) console.log(`   Query: ${JSON.stringify(query)}`);
  
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const emoji = status >= 400 ? '❌' : '✅';
    console.log(`[${timestamp}] ${emoji} RESPONSE: ${method} ${url} - Status: ${status} (${duration}ms)`);
  });
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api/farmers', farmerRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/translate', translateRoutes);

// Daily Cron Job at 00:00
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily forecast refresh...');
  try {
    await recordActuals();
    await runForecastPipeline();
    console.log('Daily forecast refresh completed.');
  } catch (error) {
    console.error('Failed to refresh forecasts:', error);
  }
});

app.get('/', (req, res) => {
  res.send('FarmSight API is running');
});

app.listen(port, () => {
  console.log('\n🚀 FARMSIGHT BACKEND INITIALIZED');
  console.log(`📡 Listening on port ${port}`);
  console.log('📝 Route logging is ACTIVE\n');
});
