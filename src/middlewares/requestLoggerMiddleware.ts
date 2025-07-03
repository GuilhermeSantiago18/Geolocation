import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { HttpStatusCode } from "../constants/httpStatus";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    const logContext = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
    };

    if (res.statusCode >= Number(HttpStatusCode.BAD_REQUEST)) {
      logger.error(logContext);
    } else {
      logger.info(logContext);
    }
  });

  next();
}
