import { Router } from 'express';

import { makeCreateShortUrlController } from '@modules/urls/factories/makeCreateShortUrlController';
import { makeGetUrlsController } from '@modules/urls/factories/makeGetUrlsController';
import { makeRedirectUrlController } from '@modules/urls/factories/makeRedirectUrlController';
import { makeGetUrlController } from '@modules/urls/factories/makeGetUrlController';
import { makeDeleteUrlController } from '@modules/urls/factories/makeDeleteUrlController';
import { makeUpdateUrlController } from '@modules/urls/factories/makeUpdateUrlController';

const urlRoutes = Router();

urlRoutes.post('/shorten', (req, res) =>
    makeCreateShortUrlController().handle(req, res)
);

urlRoutes.get('/urls', (req, res) => makeGetUrlsController().handle(req, res));

urlRoutes.get('/:shortUrlCode', (req, res) =>
    makeRedirectUrlController().handle(req, res)
);

urlRoutes.get('/urls/:id', (req, res) =>
    makeGetUrlController().handle(req, res)
);

urlRoutes.delete('/urls/:id', (req, res) =>
    makeDeleteUrlController().handle(req, res)
);

urlRoutes.patch('/urls/:id', (req, res) =>
    makeUpdateUrlController().handle(req, res)
);

export default urlRoutes;
