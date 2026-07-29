import { z } from 'zod';
import { HashProvider } from '@shared/providers/HashProvider';

export class Password {
    private static readonly passwordSchema = z
        .string()
        .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
            message: 'A senha deve conter pelo menos um símbolo.',
        })
        .regex(/[A-Z]/, {
            message: 'A senha deve conter pelo menos uma letra maiúscula.',
        })
        .regex(/[0-9]/, {
            message: 'A senha deve conter pelo menos um número.',
        });

    private constructor(readonly value: string) {}

    static async create(
        password: string,
        hashProvider: HashProvider
    ): Promise<Password> {
        Password.passwordSchema.parse(password);
        const hashedPassword = await hashProvider.hash(password);
        return new Password(hashedPassword);
    }
}
