import { z } from 'zod';

export class Email {
    private emailSchema = z.string().email({ message: 'E-mail inválido.' });

    private constructor(readonly value: string) {
        this.emailSchema.parse(value);
    }

    static create(email: string): Email {
        return new Email(email.trim().toLowerCase());
    }
}
