import { createRegionController, deleteRegionController, getRegionByPointController, listAllRegionsController, updateRegionController } from '../controllers/Region/RegionController';
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';


const router = Router();

router.get('/', asyncHandler(listAllRegionsController));
router.post('/', asyncHandler(createRegionController));
router.delete('/:id', asyncHandler(deleteRegionController));
router.put('/:id', asyncHandler(updateRegionController));
router.get('/contains', asyncHandler(getRegionByPointController));

export default router;
