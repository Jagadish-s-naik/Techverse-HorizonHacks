import { Router } from 'express';
import { getCommunitySignal } from '../controllers/communityController.js';
const router = Router();
router.get('/', getCommunitySignal);
export default router;
//# sourceMappingURL=communityRoutes.js.map