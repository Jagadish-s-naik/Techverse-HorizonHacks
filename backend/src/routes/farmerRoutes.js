import { Router } from 'express';
import { createFarmer, getFarmer, updateFarmer } from '../controllers/farmerController.js';
const router = Router();
router.post('/', createFarmer);
router.get('/:id', getFarmer);
router.patch('/:id', updateFarmer);
export default router;
//# sourceMappingURL=farmerRoutes.js.map