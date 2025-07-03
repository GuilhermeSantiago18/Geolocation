import { Request, Response, NextFunction } from "express";
import { validateObjectId } from "../validations/validateObjectId";
import { CustomError } from "../errors/CustomError";

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
      next(new CustomError("Invalid ID", 400));
    }
  }
};
