import { Region } from '../models/Region/Region';
import { IRegion } from '../types/IRegion';

const createRegionService = async (data: IRegion) => {
  return await Region.create(data);
};

const getAllRegionsService = async (): Promise<IRegion[]> => {
  return await Region.find()
};



export {
    createRegionService,
    getAllRegionsService
}