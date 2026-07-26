import { Router } from 'express';
import { createShortUrlController } from '../implementations/url';

const urlRoutes = Router();

urlRoutes.post('/shorten', (req, res) =>
    createShortUrlController.handle(req, res)
);

export default urlRoutes;
