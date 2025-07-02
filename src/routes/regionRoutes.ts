import { createRegionController, deleteRegionController, listAllRegionsController, updateRegionController } from '../controllers/Region/RegionController';
import { Router } from 'express';

const router = Router();

router.get('/', listAllRegionsController);
router.post('/', createRegionController);
router.delete('/:id', deleteRegionController);
router.put('/:id', updateRegionController);

export default router;
