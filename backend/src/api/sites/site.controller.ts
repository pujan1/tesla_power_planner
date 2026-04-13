import { Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import catchAsync from '../../utils/catchAsync';
import siteService from './site.service';
import { AuthRequest } from '../../middlewares/authMiddleware';

interface SiteRequest extends AuthRequest {
  body: any;
}

const getSites = catchAsync<ParamsDictionary, any, any, Query>(async (req: AuthRequest, res: Response) => {
  const sites = await siteService.getSites(req.user!.username);
  res.json({ count: sites.length, sites });
});

const getSite = catchAsync<{ id: string }>(async (req: AuthRequest & { params: { id: string } }, res: Response) => {
  const site = await siteService.getSite(req.params.id, req.user!.username);
  res.json({ site });
});

const createSite = catchAsync<ParamsDictionary, any, any, Query>(async (req: SiteRequest, res: Response) => {
  const site = await siteService.createSite(req.user!.username, req.body);
  res.status(201).json({ message: 'Site created successfully', site });
});

const updateSite = catchAsync<{ id: string }>(async (req: SiteRequest & { params: { id: string } }, res: Response) => {
  const site = await siteService.updateSite(req.params.id, req.user!.username, req.body);
  res.json({ message: 'Site updated successfully', site });
});

const deleteSite = catchAsync<{ id: string }>(async (req: AuthRequest & { params: { id: string } }, res: Response) => {
  const response = await siteService.deleteSite(req.params.id, req.user!.username);
  res.json(response);
});

export default {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
};
