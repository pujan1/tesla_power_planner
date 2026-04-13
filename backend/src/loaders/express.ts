import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from '../api/users/user.routes';
import siteRoutes from '../api/sites/site.routes';
import errorHandler from '../middlewares/errorHandler';
import ApiError from '../utils/ApiError';

export default async ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(express.json());

  app.use('/api', userRoutes);
  app.use('/api/sites', siteRoutes);

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, 'Not Found'));
  });

  app.use(errorHandler);
  
  return app;
};
