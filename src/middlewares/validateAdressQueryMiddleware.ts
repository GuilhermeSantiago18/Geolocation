import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";

export const validateAddressQueryMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return next(
      new CustomError(
        "Address is required and must be a string",
        HttpStatusCode.BAD_REQUEST,
      ),
    );
  }
  next();
};
