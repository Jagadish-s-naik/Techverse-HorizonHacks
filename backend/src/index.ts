import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import farmerRoutes from './routes/farmerRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

import cron from 'node-cron';
import { runForecastPipeline } from './services/forecastService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/farmers', farmerRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/community', communityRoutes);

// Daily Cron Job at 00:00
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily forecast refresh...');
  try {
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
  console.log(`Server is running on port ${port}`);
});
