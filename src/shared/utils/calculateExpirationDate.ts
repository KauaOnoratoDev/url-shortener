import ms from 'ms';

export function calculateExpirationDate(duration: string): Date {
    const now = Date.now();
    const expiresIn = duration as ms.StringValue;

    const milliseconds = ms(expiresIn);

    if (
        milliseconds === undefined ||
        !Number.isFinite(milliseconds) ||
        milliseconds <= 0
    ) {
        throw new Error('Invalid duration configured.');
    }

    const expirationDate = new Date(now + milliseconds);

    if (Number.isNaN(expirationDate.getTime())) {
        throw new Error('Invalid duration configured.');
    }

    return expirationDate;
}
