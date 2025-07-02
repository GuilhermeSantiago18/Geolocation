import { createRegion } from '../controllers/Region/RegionController';
import { Router } from 'express';

const router = Router();

router.post('/', createRegion);

export default router;
