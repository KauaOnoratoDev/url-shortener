import { calculateExpirationDate } from '@shared/utils/calculateExpirationDate';

describe('calculateExpirationDate', () => {
    it('adds the configured duration to the current time', () => {
        const now = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(now);

        expect(calculateExpirationDate('2h')).toEqual(
            new Date(now + 2 * 60 * 60 * 1000)
        );
    });

    it('throws when the duration is invalid', () => {
        expect(() => calculateExpirationDate('invalid-duration')).toThrow(
            'Invalid duration configured.'
        );
    });

    it.each(['0ms', '-1d'])('rejects a non-positive duration (%s)', (value) => {
        expect(() => calculateExpirationDate(value)).toThrow(
            'Invalid duration configured.'
        );
    });
});
