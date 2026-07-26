import { Router } from 'express';
import {
    createShortUrlController,
    getUrlsController,
    redirectUrlController,
} from '../implementations/url';

const urlRoutes = Router();

urlRoutes.post('/shorten', (req, res) =>
    createShortUrlController.handle(req, res)
);

urlRoutes.get('/urls', (req, res) => getUrlsController.handle(req, res));

urlRoutes.get('/:shortUrlCode', (req, res) =>
    redirectUrlController.handle(req, res)
);

export default urlRoutes;
