import { pgEnum } from 'drizzle-orm/pg-core';

export const userPlanEnum = pgEnum('user_plan', ['free', 'premium']);
