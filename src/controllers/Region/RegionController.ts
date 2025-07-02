import { Request, Response, NextFunction } from 'express';
import {createRegionService} from '../../services/RegionService'

export const createRegion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type, coordinates } = req.body;

    const newRegion = await createRegionService({ name, type, coordinates });

    return res.status(201).json(newRegion);
  } catch (error) {
    next(error);
  }
};
