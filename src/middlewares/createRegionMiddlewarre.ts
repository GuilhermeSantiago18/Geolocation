import { Request, Response, NextFunction } from "express";
import { validateCreateRegion } from "../validations/validateDataCreate";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";

export const validateCreateRegionMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    validateCreateRegion(req.body);
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("Validation failed", HttpStatusCode.BAD_REQUEST));
    }
  }
};
