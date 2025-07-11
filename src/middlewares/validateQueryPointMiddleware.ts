import { Request, Response, NextFunction } from "express";
import { validateDataQuery } from "../validations/validateDataQuery";
import { CustomError } from "../errors/CustomError";
import { IPoint } from "../types/regionTypes";
import { HttpStatusCode } from "../constants/httpStatus";

export const validateQueryPointMiddleware = (
  req: Request<unknown, unknown, unknown, IPoint>,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const { lng, lat, distance } = req.query;
    validateDataQuery(lng, lat, distance);
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError("Invalid query parameters", HttpStatusCode.BAD_REQUEST),
      );
    }
  }
};
