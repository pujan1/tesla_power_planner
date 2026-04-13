import { Router } from 'express';
import siteController from './site.controller';
import { authenticateToken } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken); // Protect all site routes

router.get('/', siteController.getSites);
router.post('/', siteController.createSite);
router.get('/:id', siteController.getSite);
router.put('/:id', siteController.updateSite);
router.delete('/:id', siteController.deleteSite);

export default router;
