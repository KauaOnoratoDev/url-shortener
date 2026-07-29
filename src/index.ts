import 'dotenv/config';
import express from 'express';
import { router } from '@shared/infra/http/routes';
import { errorHandler } from '@shared/middlewares/errorHandler';
import { getAuthConfig } from '@shared/config/auth';

getAuthConfig();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log('Server is listennig on PORT ' + PORT);
});
