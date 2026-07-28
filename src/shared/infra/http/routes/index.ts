import { Router } from 'express';
import urlRoutes from '../../../../modules/urls/routes/url.route';
import { userRouter } from '@modules/users/routes/user.route';

const router = Router();

router.use('/urls', urlRoutes);
router.use('/users', userRouter);

export { router };
