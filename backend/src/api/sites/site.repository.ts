import Site, { ISite } from './site.model';

const getSitesByUsername = async (username: string): Promise<any[]> => {
  const sites = await Site.find({ ownerUsername: username }).sort({ updatedAt: -1 });
  return sites.map(site => site.toJSON());
};

const getSiteById = async (id: string, username: string): Promise<any | null> => {
  const site = await Site.findOne({ _id: id, ownerUsername: username });
  return site ? site.toJSON() : null;
};

const createSite = async (username: string, siteData: any): Promise<any> => {
  const newSite = await Site.create({
    ...siteData,
    ownerUsername: username,
  });
  return newSite.toJSON();
};

const updateSite = async (id: string, username: string, updateData: any): Promise<any | null> => {
  const updatedSite = await Site.findOneAndUpdate(
    { _id: id, ownerUsername: username },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return updatedSite ? updatedSite.toJSON() : null;
};

const deleteSite = async (id: string, username: string): Promise<boolean> => {
  const result = await Site.deleteOne({ _id: id, ownerUsername: username });
  return result.deletedCount > 0;
};

export default {
  getSitesByUsername,
  getSiteById,
  createSite,
  updateSite,
  deleteSite,
};
