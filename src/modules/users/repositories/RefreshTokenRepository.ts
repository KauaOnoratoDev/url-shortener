import { RefreshToken } from '../types/RefreshToken';

export interface RefreshTokenRepository {
    create(refreshToken: RefreshToken): Promise<void>;
    findById(id: string): Promise<RefreshToken | null>;
    revoke(id: string): Promise<void>;
    rotate(currentId: string, nextToken: RefreshToken): Promise<boolean>;
}
