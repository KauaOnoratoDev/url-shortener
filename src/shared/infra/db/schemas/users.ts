import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userPlanEnum } from './enums/userPlanEnum';

export const usersTable = pgTable('users', {
    id: text().primaryKey().notNull(),

    name: text().notNull(),

    email: text().notNull().unique(),

    passwordHash: text().notNull(),

    plan: userPlanEnum('plan').default('free').notNull(),

    createdAt: timestamp({
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp({
        withTimezone: true,
    })
        .defaultNow()
        .$onUpdateFn(() => new Date())
        .notNull(),
});
