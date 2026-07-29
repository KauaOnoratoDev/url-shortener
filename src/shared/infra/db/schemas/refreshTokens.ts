import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const refreshTokensTable = pgTable(
    'refresh_tokens',
    {
        id: text().primaryKey().notNull(),
        userId: text()
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        tokenHash: text().notNull(),
        expiresIn: timestamp({ withTimezone: true }).notNull(),
        createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
        revokedAt: timestamp({ withTimezone: true }),
    },
    (table) => ({
        userIdIndex: index('refresh_tokens_user_id_idx').on(table.userId),
        expiresInIndex: index('refresh_tokens_expires_in_idx').on(
            table.expiresIn
        ),
    })
);
