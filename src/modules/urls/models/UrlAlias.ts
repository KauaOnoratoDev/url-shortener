import { z } from 'zod';

const reservedAliases = new Set(['urls', 'users']);

const urlAliasSchema = z
    .string()
    .trim()
    .min(3, 'O alias deve ter no mínimo 3 caracteres.')
    .max(64, 'O alias deve ter no máximo 64 caracteres.')
    .regex(
        /^[A-Za-z0-9_-]+$/,
        'O alias deve conter apenas letras, números, hífen ou sublinhado.'
    )
    .refine(
        (alias) => !reservedAliases.has(alias.toLowerCase()),
        'Este alias é reservado.'
    );

export class UrlAlias {
    private constructor(readonly value: string) {}

    static create(alias: string): UrlAlias {
        return new UrlAlias(urlAliasSchema.parse(alias));
    }
}
