import { Router } from 'express';
import { getOptions, getMarketOverview } from '../controllers/metaController.js';

const router = Router();

router.get('/options', getOptions);
router.get('/market/overview', getMarketOverview);

export default router;
