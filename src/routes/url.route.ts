import { Router } from 'express';
import {
    createShortUrlController,
    redirectUrlController,
} from '../implementations/url';

const urlRoutes = Router();

urlRoutes.post('/shorten', (req, res) =>
    createShortUrlController.handle(req, res)
);

urlRoutes.get('/:shortUrlCode', (req, res) =>
    redirectUrlController.handle(req, res)
);

export default urlRoutes;
