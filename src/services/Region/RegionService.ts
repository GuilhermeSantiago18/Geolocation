import { Types } from "mongoose";
import { Region } from "../../models/Region/RegionModel";
import { IRegion, IPoint } from "../../types/IRegion";

const createRegionService = async (data: IRegion): Promise<IRegion> => {
  return await Region.create(data);
};

const getAllRegionsService = async (): Promise<IRegion[]> => {
  return await Region.find();
};

const deleteRegionService = async (
  id: string | Types.ObjectId,
): Promise<{ deletedCount?: number }> => {
  return await Region.deleteOne({ _id: id });
};

const updateRegionService = async (
  id: string | Types.ObjectId,
  data: Partial<IRegion>,
): Promise<IRegion | null> => {
  return await Region.findByIdAndUpdate(id, data, { new: true });
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

export {
  createRegionService,
  getAllRegionsService,
  deleteRegionService,
  updateRegionService,
  getRegionByPointService,
  getRegionsByDistanceService,
};
