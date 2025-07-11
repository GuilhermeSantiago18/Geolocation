import { Request, Response, NextFunction } from "express";
import { validateObjectId } from "../validations/validateObjectId";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";

export const validateObjectIdMiddleware = (
  req: Request<{ id: string }>,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    validateObjectId(req.params.id);
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError("Invalid ID", HttpStatusCode.BAD_REQUEST));
    }
  }
};
