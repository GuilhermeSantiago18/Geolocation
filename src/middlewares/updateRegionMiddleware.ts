import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";
import { validateUpdateRegion } from "../validations/validateDataUpdate";
import { IRegion } from "../types/regionTypes";

export const validateUpdateRegionMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    validateUpdateRegion(req.body as Partial<IRegion>);
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("Validation failed", HttpStatusCode.BAD_REQUEST));
    }
  }
};
