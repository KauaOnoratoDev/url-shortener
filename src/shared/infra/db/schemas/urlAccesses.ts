import {
    check,
    index,
    integer,
    pgEnum,
    pgTable,
    timestamp,
    uniqueIndex,
    varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { shortUrlsTable } from './shortUrls';

export const deviceTypeEnum = pgEnum('device_type', [
    'desktop',
    'mobile',
    'tablet',
    'unknown',
]);

export const urlAccessesTable = pgTable(
    'url_accesses',
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),

        shortUrlId: integer()
            .notNull()
            .references(() => shortUrlsTable.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),

        accessedAt: timestamp({
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        browser: varchar({ length: 100 }).default('Unknown').notNull(),

        operatingSystem: varchar({ length: 100 }).default('Unknown').notNull(),

        deviceType: deviceTypeEnum().default('unknown').notNull(),

        country: varchar({ length: 100 }),

        state: varchar({ length: 100 }),

        city: varchar({ length: 150 }),
    },
    (table) => [
        index('url_accesses_short_url_accessed_at_idx').on(
            table.shortUrlId,
            table.accessedAt
        ),
        index('url_accesses_short_url_browser_idx').on(
            table.shortUrlId,
            table.browser
        ),
        index('url_accesses_short_url_os_idx').on(
            table.shortUrlId,
            table.operatingSystem
        ),
        index('url_accesses_short_url_device_idx').on(
            table.shortUrlId,
            table.deviceType
        ),
        index('url_accesses_short_url_location_idx').on(
            table.shortUrlId,
            table.country,
            table.state,
            table.city
        ),
    ]
);

export const urlAnalyticsLegacyTable = pgTable(
    'url_analytics_legacy',
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),

        shortUrlId: integer()
            .notNull()
            .references(() => shortUrlsTable.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),

        accessCount: integer().notNull(),
    },
    (table) => [
        check(
            'url_analytics_legacy_access_count_check',
            sql`${table.accessCount} >= 0`
        ),
        uniqueIndex('url_analytics_legacy_short_url_id_idx').on(
            table.shortUrlId
        ),
    ]
);
