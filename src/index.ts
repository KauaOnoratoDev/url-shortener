import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from '@shared/infra/http/routes';
import { errorHandler } from '@shared/middlewares/errorHandler';
import { getAuthConfig } from '@shared/config/auth';
import { getHashidsConfig } from '@shared/config/hashids';
import { getServerConfig } from '@shared/config/server';

getAuthConfig();
getHashidsConfig();

const serverConfig = getServerConfig();

const app = express();

app.use(cors(serverConfig.cors));
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(serverConfig.port, () => {
    console.log(`Server is listening on port ${serverConfig.port}`);
});
