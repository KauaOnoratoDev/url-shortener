import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';

import { usersTable } from './users';

export const shortUrlsTable = pgTable('short_urls', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    shortUrlCode: text().unique(),

    fullUrl: text().notNull(),

    userId: text()
        .notNull()
        .references(() => usersTable.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade',
        }),

    createdAt: timestamp({
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),

    expiresAt: timestamp({
        withTimezone: true,
    }),

    expired: boolean().default(false).notNull(),

    alias: text(),
});
