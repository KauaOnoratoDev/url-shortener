import { Router } from 'express';
import {
    createShortUrlController,
    deleteUrlController,
    getUrlController,
    getUrlsController,
    redirectUrlController,
    updateUrlController,
} from '../implementations/url';

const urlRoutes = Router();

urlRoutes.post('/shorten', (req, res) =>
    createShortUrlController.handle(req, res)
);

urlRoutes.get('/urls', (req, res) => getUrlsController.handle(req, res));

urlRoutes.get('/:shortUrlCode', (req, res) =>
    redirectUrlController.handle(req, res)
);

urlRoutes.get('/urls/:id', (req, res) => getUrlController.handle(req, res));

urlRoutes.delete('/urls/:id', (req, res) =>
    deleteUrlController.handle(req, res)
);

urlRoutes.patch('/urls/:id', (req, res) =>
    updateUrlController.handle(req, res)
);
export default urlRoutes;
