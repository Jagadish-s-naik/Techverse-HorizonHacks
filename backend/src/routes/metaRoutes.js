import { Router } from 'express';
import { getOptions } from '../controllers/metaController.js';
const router = Router();
router.get('/options', getOptions);
export default router;
//# sourceMappingURL=metaRoutes.js.map