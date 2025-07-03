import { Request, Response } from "express";
import {
  createRegionService,
  deleteRegionService,
  getAllRegionsService,
  getRegionByPointService,
  getRegionsByAddressService,
  getRegionsByDistanceService,
  updateRegionService,
} from "../../services/region/regionService";
import { IPoint, IRegion } from "../../types/regionTypes";
import { CustomError } from "../../errors/CustomError";
import { validateDataQuery } from "../../validations/validateDataQuery";
import { validateUpdateRegion } from "../../validations/validateDataUpdate";
import { HttpStatusCode } from "../../constants/httpStatus";

const createRegionController = async (
  req: Request<unknown, unknown, IRegion>,
  res: Response,
): Promise<void> => {
  const { name, geometry } = req.body;

  const newRegion = await createRegionService({ name, geometry });

  res.status(HttpStatusCode.CREATED).json(newRegion);
};

const listAllRegionsController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const allRegions = await getAllRegionsService();
  res.status(HttpStatusCode.OK).json(allRegions);
};

const deleteRegionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  await deleteRegionService(id);
  res.status(HttpStatusCode.NO_CONTENT).send();
};

const updateRegionController = async (
  req: Request<{ id: string }, unknown, Partial<IRegion>>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  validateUpdateRegion(data);

  const updatedRegion = await updateRegionService(id, data);
  res.status(HttpStatusCode.OK).json(updatedRegion);
};

const getRegionByPointController = async (
  req: Request<unknown, unknown, unknown, IPoint>,
  res: Response,
): Promise<void> => {
  const { lng, lat } = req.query;
  const validateData = validateDataQuery(lng, lat);

  const regions = await getRegionByPointService(validateData);
  res.status(HttpStatusCode.OK).json(regions);
};

const getRegionByDistanceController = async (
  req: Request<unknown, unknown, unknown, IPoint>,
  res: Response,
): Promise<void> => {
  const { lng, lat, distance } = req.query;
  const validatedData = validateDataQuery(lng, lat, distance);
  const regions = await getRegionsByDistanceService(validatedData);
  res.status(HttpStatusCode.OK).json(regions);
};

const getRegionsByAddressController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    throw new CustomError(
      "Address is required and must be a string",
      HttpStatusCode.BAD_REQUEST,
    );
  }

  const regions = await getRegionsByAddressService(address);
  res.status(HttpStatusCode.OK).json(regions);
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
