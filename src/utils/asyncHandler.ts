import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler<P, ResBody, ReqBody, ReqQuery>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
