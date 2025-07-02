import { Request, Response, NextFunction } from "express";
import {
  createRegionService,
  deleteRegionService,
  getAllRegionsService,
  getRegionByPointService,
  getRegionsByAddressService,
  getRegionsByDistanceService,
  updateRegionService,
} from "../../services/Region/RegionService";
import { IRegion } from "../../types/IRegion";
import { CustomError } from "../../errors/CustomError";

const createRegionController = async (
  req: Request<unknown, unknown, IRegion>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, geometry } = req.body;

    if (!name || typeof name !== "string") {
      throw new CustomError("Name is required and must be a string", 400);
    }
    if (!geometry || typeof geometry !== "object") {
      throw new CustomError("Geometry is required and must be an object", 400);
    }

    const newRegion = await createRegionService({ name, geometry });

    res.status(201).json(newRegion);
  } catch (error) {
    next(error);
  }
};

const listAllRegionsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allRegions = await getAllRegionsService();
    res.status(200).json(allRegions);
  } catch (error) {
    next(error);
  }
};

const deleteRegionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      throw new CustomError("Region ID is required and must be a string", 400);
    }
    await deleteRegionService(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateRegionController = async (
  req: Request<{ id: string }, unknown, Partial<IRegion>>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new CustomError("Region ID is required and must be a string", 400);
    }
    const data = req.body;
    if (!data || typeof data !== "object") {
      throw new CustomError(
        "Update data is required and must be an object",
        400,
      );
    }
    const updatedRegion = await updateRegionService(id, data);
    res.status(200).send(updatedRegion);
  } catch (error) {
    next(error);
  }
};

export const getRegionByPointController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { lng, lat } = req.query;
    console.log("query", req.query);

    if (!lng || !lat) {
      throw new CustomError(
        "Longitude (lng) and latitude (lat) are required",
        400,
      );
    }

    const lngNum = Number(lng);
    const latNum = Number(lat);
    if (Number.isNaN(lngNum) || Number.isNaN(latNum)) {
      throw new CustomError(
        "Longitude (lng) and latitude (lat) must be valid numbers",
        400,
      );
    }

    const point = {
      lng: lngNum,
      lat: latNum,
    };

    const regions = await getRegionByPointService(point);
    res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

const getRegionByDistanceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { lng, lat, distance } = req.query;

    if (!lng || !lat || !distance) {
      throw new CustomError(
        "Longitude (lng), latitude (lat) and distance are required",
        400,
      );
    }

    const lngNum = Number(lng);
    const latNum = Number(lat);
    const distanceNum = Number(distance);

    if (
      Number.isNaN(lngNum) ||
      Number.isNaN(latNum) ||
      Number.isNaN(distanceNum) ||
      distanceNum < 0
    ) {
      throw new CustomError(
        "Longitude (lng), latitude (lat) must be valid numbers and distance must be a non-negative number",
        400,
      );
    }

    const point = {
      lng: lngNum,
      lat: latNum,
      distance: distanceNum,
    };

    const regions = await getRegionsByDistanceService(point);
    res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

const getRegionsByAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { address } = req.query;

    if (!address || typeof address !== "string") {
      throw new CustomError("Address is required and must be a string", 400);
    }

    const regions = await getRegionsByAddressService(address);

    res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

export {
  createRegionController,
  listAllRegionsController,
  deleteRegionController,
  updateRegionController,
  getRegionByDistanceController,
  getRegionsByAddressController,
};
