import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export const errorMiddleware = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message;

  res.status(statusCode).json({
    errorMessage: message,
  });
};
