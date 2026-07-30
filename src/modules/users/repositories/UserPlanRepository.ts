import { PlanValue } from '../models/Plan';

export interface UserPlanRepository {
    findPlanByUserId(userId: string): Promise<PlanValue | null>;
}
