import { Router } from 'express';
import { simulateReceiveSMS } from '../controllers/smsController.js';

const router = Router();

router.post('/simulate-receive', simulateReceiveSMS);

export default router;
