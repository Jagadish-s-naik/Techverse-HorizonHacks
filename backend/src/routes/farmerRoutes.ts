import { Router } from 'express';
import { createFarmer, getFarmer, updateFarmer } from '../controllers/farmerController';

const router = Router();

router.post('/', createFarmer);
router.get('/:id', getFarmer);
router.patch('/:id', updateFarmer);

export default router;
