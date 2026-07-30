import { Plan } from '@modules/users/models/Plan';

describe('Plan', () => {
    it.each(['free', 'premium'])('accepts the %s plan', (value) => {
        expect(Plan.create(value).value).toBe(value);
    });

    it('rejects an unknown plan', () => {
        expect(() => Plan.create('enterprise')).toThrow('Plano inválido.');
    });
});
