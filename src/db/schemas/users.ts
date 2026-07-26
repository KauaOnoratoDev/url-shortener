import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: text().primaryKey().notNull(),

    name: text().notNull(),

    email: text().notNull().unique(),

    passwordHash: text().notNull(),

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
