import { z } from 'zod';

export class Name {
    private nameSchema = z
        .string()
        .min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' })
        .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/, {
            message: 'O nome não pode conter números ou símbolos.',
        });

    private constructor(readonly value: string) {
        this.nameSchema.parse(value);
    }

    static create(name: string): Name {
        return new Name(name);
    }
}
