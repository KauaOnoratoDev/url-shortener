import { z } from 'zod';
import { HashProvider } from '@shared/providers/HashProvider';

export class Password {
    private passwordSchema = z
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

    private constructor(readonly value: string) {
        this.passwordSchema.parse(value);
    }

    static async create(
        password: string,
        hashProvider: HashProvider
    ): Promise<Password> {
        const hashedPassword = await hashProvider.hash(password);
        return new Password(hashedPassword);
    }
}
