import { z } from 'zod';

export const planSchema = z.enum(['free', 'premium'], {
    error: 'Plano inválido.',
});

export type PlanValue = z.infer<typeof planSchema>;

export class Plan {
    private constructor(readonly value: PlanValue) {}

    static create(plan: string): Plan {
        return new Plan(planSchema.parse(plan));
    }
}
