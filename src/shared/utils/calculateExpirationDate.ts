import ms from 'ms';

export function calculateExpirationDate(duration: string): Date {
    const now = Date.now();
    const expiresIn = duration as ms.StringValue;

    const milliseconds = ms(expiresIn);

    if (milliseconds === undefined || !Number.isFinite(milliseconds)) {
        throw new Error('Invalid duration configured.');
    }

    return new Date(now + milliseconds);
}
