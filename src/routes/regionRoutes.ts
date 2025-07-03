import {
  createRegionController,
  deleteRegionController,
  getRegionByDistanceController,
  getRegionByPointController,
  getRegionsByAddressController,
  listAllRegionsController,
  updateRegionController,
} from "../controllers/region/RegionController";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCreateRegionMiddleware } from "../middlewares/createRegionMiddlewarre";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { validateUpdateRegionMiddleware } from "../middlewares/validateUpdateRegionMiddleware";
import { validateQueryPointMiddleware } from "../middlewares/validateQueryPointMiddleware";
import { validateAddressQueryMiddleware } from "../middlewares/validateAdressQueryMiddleware";

const router = Router();

router.get("/", asyncHandler(listAllRegionsController));
router.post(
  "/",
  validateCreateRegionMiddleware,
  asyncHandler(createRegionController),
);
router.delete(
  "/:id",
  validateObjectIdMiddleware,
  asyncHandler(deleteRegionController),
);
router.put(
  "/:id",
  validateObjectIdMiddleware,
  validateUpdateRegionMiddleware,
  asyncHandler(updateRegionController),
);
router.get(
  "/contains",
  validateQueryPointMiddleware,
  asyncHandler(getRegionByPointController),
);
router.get(
  "/nearby",
  validateQueryPointMiddleware,
  asyncHandler(getRegionByDistanceController),
);
router.get(
  "/address",
  validateAddressQueryMiddleware,
  asyncHandler(getRegionsByAddressController),
);

export default router;
