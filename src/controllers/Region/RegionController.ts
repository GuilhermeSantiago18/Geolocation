import { Request, Response, NextFunction } from 'express';
import {createRegionService, deleteRegionService, getAllRegionsService, updateRegionService} from '../../services/Region/RegionService'
import { IRegion } from '../../types/IRegion';

const createRegionController = async (req: Request<{ id: string }, unknown, Partial<IRegion>>, res: Response, next: NextFunction) => {
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

const deleteRegionController  = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params
    await deleteRegionService(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


const updateRegionController  = async (req: Request<{ id: string }, unknown, Partial<IRegion>>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params
    const data = req.body
    const updatedRegion = await updateRegionService(id, data);
    res.status(200).send(updatedRegion);
  } catch (error) {
    next(error);
  }
};


export {createRegionController, listAllRegionsController, deleteRegionController, updateRegionController}
