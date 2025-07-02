import { createRegionController, deleteRegionController, listAllRegionsController } from '../controllers/Region/RegionController';
import { Router } from 'express';

const router = Router();

router.get('/', listAllRegionsController);
router.post('/', createRegionController);
router.delete('/:id', deleteRegionController);

export default router;
