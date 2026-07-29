import { Router } from 'express';
import { makeRegisterUserController } from '../factories/makeRegisterUserController';
import { makeLoginUserController } from '../factories/makeLoginUserController';
import { makeRefreshUserTokenController } from '../factories/makeRefreshUserTokenController';
import { makeLogoutUserController } from '../factories/makeLogoutUserController';

const userRouter = Router();

userRouter.post('/register', (req, res) =>
    makeRegisterUserController().handle(req, res)
);

userRouter.post('/login', (req, res) =>
    makeLoginUserController().handle(req, res)
);

userRouter.post('/refresh', (req, res) =>
    makeRefreshUserTokenController().handle(req, res)
);

userRouter.post('/logout', (req, res) =>
    makeLogoutUserController().handle(req, res)
);

export { userRouter };
