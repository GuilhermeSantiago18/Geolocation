import { Types } from "mongoose";
import { Region } from "../../models/region/regionModel";
import { IRegion, IPoint } from "../../types/regionTypes";
import { geocodeAddress } from "../geoCodingService";
import { CustomError } from "../../errors/CustomError";

const createRegionService = async (data: IRegion): Promise<IRegion> => {
  return await Region.create(data);
};

const getAllRegionsService = async (): Promise<IRegion[]> => {
  return await Region.find();
};

const deleteRegionService = async (
  id: string | Types.ObjectId,
): Promise<void> => {
  const getRegionById = await Region.findOne({ _id: id });
  if (!getRegionById) {
    throw new CustomError("Region not found", 404);
  }

  await Region.deleteOne({ _id: id });
};

const updateRegionService = async (
  id: string | Types.ObjectId,
  data: Partial<IRegion>,
): Promise<IRegion> => {
  const updated = await Region.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new CustomError("Region not found", 404);
  }
  return updated;
};

const getRegionByPointService = async ({
  lng,
  lat,
}: IPoint): Promise<IRegion[]> => {
  return await Region.find({
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    },
  });
};

const getRegionsByDistanceService = async ({ lng, lat, distance }: IPoint) => {
  const EARTH_RADIUS_METERS = 6378137;

  const radiusInRadians = distance / EARTH_RADIUS_METERS;

  const regions = await Region.find({
    geometry: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radiusInRadians],
      },
    },
  });

  return regions;
};

const getRegionsByAddressService = async (address: string) => {
  const coords = await geocodeAddress(address);

  return await Region.find({
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        },
      },
    },
  });
};

export {
  createRegionService,
  getAllRegionsService,
  deleteRegionService,
  updateRegionService,
  getRegionByPointService,
  getRegionsByDistanceService,
  getRegionsByAddressService,
};
