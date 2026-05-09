import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import farmerRoutes from './routes/farmerRoutes';
import forecastRoutes from './routes/forecastRoutes';
import communityRoutes from './routes/communityRoutes';
import smsRoutes from './routes/smsRoutes';

import cron from 'node-cron';
import { runForecastPipeline } from './services/forecastService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/farmers', farmerRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/sms', smsRoutes);

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
  console.log(`Server is running on port ${port}`);
});
