import { Router } from 'express';
import urlRoutes from '../../../../modules/urls/routes/url.route';
import { userRouter } from '@modules/users/routes/user.route';
import { makeRedirectUrlController } from '@modules/urls/factories/makeRedirectUrlController';

const router = Router();

router.use('/urls', urlRoutes);
router.use('/users', userRouter);

router.get('/:shortUrlCode', (req, res) =>
    makeRedirectUrlController().handle(req, res)
);

export { router };
