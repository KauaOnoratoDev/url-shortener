import { z } from 'zod';

export class ValidateUrlProvider {
    private urlSchema = z
        .string()
        .url({
            error: 'URL inválida',
        })
        .refine(
            (url) => {
                const protocol = new URL(url).protocol;

                return protocol === 'http:' || protocol === 'https:';
            },
            {
                error: 'A URL deve utilizar HTTP ou HTTPS',
            }
        );

    validate(url: string) {
        const result = this.urlSchema.safeParse(url);

        if (!result.success) {
            throw new Error(result.error.message);
        }
    }
}
