import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";

export const errorMiddleware = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message;

  res.status(statusCode).json({
    errorMessage: message,
  });
};
