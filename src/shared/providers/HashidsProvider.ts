import Hashids from 'hashids';
import 'dotenv/config';

export class HashidsProvider {
    encode(urlId: number): string {
        const SALT = process.env.SALT;
        const MIN_LENGHT = Number(process.env.MIN_LENGHT);
        const ALPHABET = process.env.ALPHABET;
        const hashids = new Hashids(SALT, MIN_LENGHT, ALPHABET);

        return hashids.encode(urlId);
    }
}
