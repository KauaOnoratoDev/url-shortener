import {
    boolean,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
} from 'drizzle-orm/pg-core';

import { usersTable } from './users';

export const shortUrlsTable = pgTable(
    'short_urls',
    {
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
    },
    (table) => [
        index('short_urls_user_id_idx').on(table.userId),
        uniqueIndex('short_urls_alias_unique_idx').on(table.alias),
    ]
);
