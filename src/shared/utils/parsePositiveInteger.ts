export function parsePositiveInteger(value: unknown): number | null {
    if (typeof value !== 'string' || !/^\d+$/.test(value)) {
        return null;
    }

    const parsed = Number(value);

    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
