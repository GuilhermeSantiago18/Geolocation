import {
  createRegionController,
  deleteRegionController,
  getRegionByDistanceController,
  getRegionByPointController,
  getRegionsByAddressController,
  listAllRegionsController,
  updateRegionController,
} from "../controllers/region/regionController";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validateCreateRegionMiddleware } from "../middlewares/createRegionMiddlewarre";

const router = Router();

router.get("/", asyncHandler(listAllRegionsController));
router.post(
  "/",
  validateCreateRegionMiddleware,
  asyncHandler(createRegionController),
);
router.delete("/:id", asyncHandler(deleteRegionController));
router.put("/:id", asyncHandler(updateRegionController));
router.get("/contains", asyncHandler(getRegionByPointController));
router.get("/nearby", asyncHandler(getRegionByDistanceController));
router.get("/address", asyncHandler(getRegionsByAddressController));

export default router;
