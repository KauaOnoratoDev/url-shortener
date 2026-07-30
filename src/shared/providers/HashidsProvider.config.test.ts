import { HashidsProvider } from '@shared/providers/HashidsProvider';
import { getHashidsConfig } from '@shared/config/hashids';

describe('Hashids configuration', () => {
    const originalSalt = process.env.SALT;
    const originalMinLength = process.env.MIN_LENGTH;
    const originalLegacyMinLength = process.env.MIN_LENGHT;
    const originalAlphabet = process.env.ALPHABET;

    beforeEach(() => {
        process.env.SALT = 's'.repeat(32);
        delete process.env.MIN_LENGTH;
        process.env.MIN_LENGHT = '6';
        delete process.env.ALPHABET;
    });

    afterAll(() => {
        const restore = (name: string, value: string | undefined) => {
            if (value === undefined) delete process.env[name];
            else process.env[name] = value;
        };

        restore('SALT', originalSalt);
        restore('MIN_LENGTH', originalMinLength);
        restore('MIN_LENGHT', originalLegacyMinLength);
        restore('ALPHABET', originalAlphabet);
    });

    it('supports the legacy minimum-length variable without changing codes', () => {
        expect(getHashidsConfig().minLength).toBe(6);
        expect(new HashidsProvider().encode(1)).toHaveLength(6);
    });

    it('prefers the correctly spelled minimum-length variable', () => {
        process.env.MIN_LENGTH = '8';

        expect(new HashidsProvider().encode(1)).toHaveLength(8);
    });

    it('uses the Hashids default alphabet when the variable is empty', () => {
        process.env.ALPHABET = '';

        expect(getHashidsConfig().alphabet).toBeUndefined();
        expect(new HashidsProvider().encode(1)).toHaveLength(6);
    });

    it('rejects weak salts and invalid minimum lengths', () => {
        process.env.SALT = 'short';
        expect(() => getHashidsConfig()).toThrow(
            'SALT must contain at least 16 characters.'
        );

        process.env.SALT = 's'.repeat(32);
        process.env.MIN_LENGTH = 'not-a-number';
        expect(() => getHashidsConfig()).toThrow();
    });
});
