import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import farmerRoutes from './routes/farmerRoutes';
import forecastRoutes from './routes/forecastRoutes';
import communityRoutes from './routes/communityRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/farmers', farmerRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.send('FarmSight API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
