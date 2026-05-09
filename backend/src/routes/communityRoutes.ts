import { Router } from 'express';
import { getCommunitySignal } from '../controllers/communityController';

const router = Router();

router.get('/', getCommunitySignal);

export default router;
