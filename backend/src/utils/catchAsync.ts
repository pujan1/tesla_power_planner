import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

type AsyncHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<any>;

const catchAsync = <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query>(
  fn: AsyncHandler<P, ResBody, ReqBody, ReqQuery>
) => (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;

