import { Router } from 'express';

import { makeCreateShortUrlController } from '@modules/urls/factories/makeCreateShortUrlController';
import { makeGetUrlsController } from '@modules/urls/factories/makeGetUrlsController';
import { makeGetUrlController } from '@modules/urls/factories/makeGetUrlController';
import { makeDeleteUrlController } from '@modules/urls/factories/makeDeleteUrlController';
import { makeUpdateUrlController } from '@modules/urls/factories/makeUpdateUrlController';
import { authMiddleware } from '@shared/middlewares/authMiddleware';

const urlRoutes = Router();

urlRoutes.post('/', authMiddleware, (req, res) =>
    makeCreateShortUrlController().handle(req, res)
);

urlRoutes.get('/', authMiddleware, (req, res) =>
    makeGetUrlsController().handle(req, res)
);

urlRoutes.get('/:id', authMiddleware, (req, res) =>
    makeGetUrlController().handle(req, res)
);

urlRoutes.delete('/:id', authMiddleware, (req, res) =>
    makeDeleteUrlController().handle(req, res)
);

urlRoutes.patch('/:id', authMiddleware, (req, res) =>
    makeUpdateUrlController().handle(req, res)
);

export default urlRoutes;
