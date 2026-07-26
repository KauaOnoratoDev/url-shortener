import { Router } from 'express';
import urlRoutes from './url.route';

const router = Router();

router.use('/', urlRoutes);

export { router };
