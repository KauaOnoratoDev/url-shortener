import type { TokenPayload } from '@shared/providers/TokenProvider';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export {};
