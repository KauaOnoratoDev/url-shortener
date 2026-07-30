import { index, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { shortUrlsTable } from './shortUrls';

export const shortUrlIdentifiersTable = pgTable(
    'short_url_identifiers',
    {
        identifier: text().primaryKey(),
        shortUrlId: integer()
            .notNull()
            .references(() => shortUrlsTable.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
    },
    (table) => [
        index('short_url_identifiers_short_url_id_idx').on(table.shortUrlId),
    ]
);
