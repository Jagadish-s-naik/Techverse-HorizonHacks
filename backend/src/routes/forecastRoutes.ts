import { Router } from 'express';
import { getLatestForecast, getForecastHistory } from '../controllers/forecastController';

const router = Router();

router.get('/', getLatestForecast);
router.get('/history', getForecastHistory);

export default router;
