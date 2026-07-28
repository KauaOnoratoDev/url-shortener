import { Router } from 'express';
import { makeRegisterUserController } from '../factories/makeRegisterUserController';

const userRouter = Router();

userRouter.post('/register', (req, res) =>
    makeRegisterUserController().handle(req, res)
);

export { userRouter };
