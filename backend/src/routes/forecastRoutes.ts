import { Router } from 'express';
import { getLatestForecast, getForecastHistory } from '../controllers/forecastController.js';

const router = Router();

router.get('/', getLatestForecast);
router.get('/history', getForecastHistory);

export default router;
