import { createRegionController, listAllRegionsController } from '../controllers/Region/RegionController';
import { Router } from 'express';

const router = Router();

router.get('/', listAllRegionsController);
router.post('/', createRegionController);

export default router;
