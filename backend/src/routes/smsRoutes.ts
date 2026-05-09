import { Router } from 'express';
import { simulateReceiveSMS } from '../controllers/smsController';

const router = Router();

router.post('/simulate-receive', simulateReceiveSMS);

export default router;
