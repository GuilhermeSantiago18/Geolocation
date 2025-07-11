import { Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";
import { IRequestWithTranslation } from "../types/requestTranslation";

export const errorMiddleware = (
  err: Error | CustomError,
  req: IRequestWithTranslation,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message;

  const options = err instanceof CustomError ? err.options : undefined;
  const translatedMessage = req.t?.(message, options) || message;

  res.status(statusCode).json({
    errorMessage: translatedMessage,
  });
};
