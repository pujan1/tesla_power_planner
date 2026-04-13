import siteRepository from './site.repository';
import ApiError from '../../utils/ApiError';
import mongoose from 'mongoose';

const getSites = async (username: string) => {
  return siteRepository.getSitesByUsername(username);
};

const getSite = async (id: string, username: string) => {
  const site = await siteRepository.getSiteById(id, username);
  if (!site) {
    throw new ApiError(404, 'Site not found');
  }
  return site;
};

const createSite = async (username: string, siteData: any) => {
  if (!siteData.name || !Array.isArray(siteData.devices)) {
    throw new ApiError(400, 'Invalid site data: missing name or devices');
  }
  
  // If no ID is provided, create a fresh ID
  if (!siteData.id) {
    siteData._id = new mongoose.Types.ObjectId().toString();
  } else {
    siteData._id = siteData.id;
  }

  return siteRepository.createSite(username, siteData);
};

const updateSite = async (id: string, username: string, siteData: any) => {
  const existing = await siteRepository.getSiteById(id, username);
  if (!existing) {
    throw new ApiError(404, 'Site not found');
  }

  return siteRepository.updateSite(id, username, siteData);
};

const deleteSite = async (id: string, username: string) => {
  const existing = await siteRepository.getSiteById(id, username);
  if (!existing) {
    throw new ApiError(404, 'Site not found');
  }

  await siteRepository.deleteSite(id, username);
  return { message: 'Site deleted successfully' };
};

export default {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
};
