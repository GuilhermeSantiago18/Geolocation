import { Request, Response } from "express";
import {
  createRegionService,
  deleteRegionService,
  getAllRegionsService,
  getRegionByPointService,
  getRegionsByAddressService,
  getRegionsByDistanceService,
  updateRegionService,
} from "../../services/Region/RegionService";
import { IPoint, IRegion } from "../../types/IRegion";
import { CustomError } from "../../errors/CustomError";
import { validateDataQuery } from "../../validations/validateDataQuery";
import { validateCreateRegion } from "../../validations/validateDataCreate";
import { validateUpdateRegion } from "../../validations/validateDataUpdate";
import { validateObjectId } from "../../validations/validateObjectId";

const createRegionController = async (
  req: Request<unknown, unknown, IRegion>,
  res: Response,
): Promise<void> => {
  const { name, geometry } = req.body;

  validateCreateRegion(req.body);

  const newRegion = await createRegionService({ name, geometry });

  res.status(201).json(newRegion);
};

const listAllRegionsController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const allRegions = await getAllRegionsService();
  res.status(200).json(allRegions);
};

const deleteRegionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  validateObjectId(id);

  await deleteRegionService(id);
  res.status(204).send();
};

const updateRegionController = async (
  req: Request<{ id: string }, unknown, Partial<IRegion>>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  validateObjectId(id);
  validateUpdateRegion(data);

  const updatedRegion = await updateRegionService(id, data);
  res.status(200).json(updatedRegion);
};

const getRegionByPointController = async (
  req: Request<unknown, unknown, unknown, IPoint>,
  res: Response,
): Promise<void> => {
  const { lng, lat } = req.query;
  const validateData = validateDataQuery(lng, lat);

  const regions = await getRegionByPointService(validateData);
  res.status(200).json(regions);
};

const getRegionByDistanceController = async (
  req: Request<unknown, unknown, unknown, IPoint>,
  res: Response,
): Promise<void> => {
  const { lng, lat, distance } = req.query;
  const validatedData = validateDataQuery(lng, lat, distance);
  const regions = await getRegionsByDistanceService(validatedData);
  res.status(200).json(regions);
};

const getRegionsByAddressController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    throw new CustomError("Address is required and must be a string", 400);
  }

  const regions = await getRegionsByAddressService(address);
  res.status(200).json(regions);
};

export {
  createRegionController,
  listAllRegionsController,
  deleteRegionController,
  updateRegionController,
  getRegionByPointController,
  getRegionByDistanceController,
  getRegionsByAddressController,
};
