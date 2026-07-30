import Hashids from 'hashids';
import { getHashidsConfig, HashidsConfig } from '@shared/config/hashids';

export class HashidsProvider {
    private readonly hashids: Hashids;

    constructor(config: HashidsConfig = getHashidsConfig()) {
        this.hashids = new Hashids(
            config.salt,
            config.minLength,
            config.alphabet
        );
    }

    encode(urlId: number): string {
        const code = this.hashids.encode(urlId);

        if (!code) {
            throw new Error('Could not generate a short URL code.');
        }

        return code;
    }
}
