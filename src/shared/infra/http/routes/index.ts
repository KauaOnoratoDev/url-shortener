import { Router } from 'express';
import urlRoutes from '../../../../modules/urls/routes/url.route';

const router = Router();

router.use('/', urlRoutes);

export { router };
