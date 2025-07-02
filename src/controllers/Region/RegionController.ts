import { Request, Response, NextFunction } from 'express';
import {createRegionService, getAllRegionsService} from '../../services/RegionService'
import { IRegion } from '../../types/IRegion';

const createRegionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type, coordinates } = req.body;

    const newRegion = await createRegionService({ name, type, coordinates });

    return res.status(201).json(newRegion);
  } catch (error) {
    next(error);
  }
};


const listAllRegionsController  = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allRegions = await getAllRegionsService();
    res.status(200).json(allRegions);
  } catch (error) {
    next(error);
  }
};


export {createRegionController, listAllRegionsController}
