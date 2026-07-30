import { z } from 'zod';

const hashidsConfigSchema = z.object({
    salt: z.string().min(16, 'SALT must contain at least 16 characters.'),
    minLength: z.coerce.number().int().min(4).max(128).default(6),
    alphabet: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z
            .string()
            .refine(
                (value) => new Set(value).size >= 16,
                'ALPHABET must contain at least 16 unique characters.'
            )
            .optional()
    ),
});

export type HashidsConfig = z.infer<typeof hashidsConfigSchema>;

export function getHashidsConfig(): HashidsConfig {
    return hashidsConfigSchema.parse({
        salt: process.env.SALT,
        minLength:
            process.env.MIN_LENGTH ?? process.env.MIN_LENGHT ?? undefined,
        alphabet: process.env.ALPHABET,
    });
}
