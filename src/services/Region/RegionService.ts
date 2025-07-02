import { Types } from 'mongoose';
import { Region } from '../../models/Region/Region';
import { IRegion } from '../../types/IRegion';

const createRegionService = async (data: IRegion): Promise<IRegion> => {
  return await Region.create(data);
};

const getAllRegionsService = async (): Promise<IRegion[]> => {
  return await Region.find();
};

const deleteRegionService = async (id: string | Types.ObjectId): Promise<{ deletedCount?: number }> => {
  return await Region.deleteOne({ _id: id });
};

const updateRegionService = async (id: string | Types.ObjectId, data: Partial<IRegion>): Promise<IRegion | null> => {
  return await Region.findByIdAndUpdate(id, data, { new: true });
};




export {
    createRegionService,
    getAllRegionsService,
    deleteRegionService,
    updateRegionService
    
}