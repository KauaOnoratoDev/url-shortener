import { PlanValue } from './Plan';

export class User {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly passwordHash: string,
        readonly createdAt: Date,
        readonly updatedAt: Date,
        readonly plan: PlanValue
    ) {}
}
