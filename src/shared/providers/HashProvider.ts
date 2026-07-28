import argon2 from 'argon2';

export class HashProvider {
    async hash(string: string): Promise<string> {
        return await argon2.hash(string);
    }

    async compare(string: string, hash: string): Promise<boolean> {
        return await argon2.verify(hash, string);
    }
}
