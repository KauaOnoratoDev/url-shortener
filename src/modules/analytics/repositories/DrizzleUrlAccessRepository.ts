import { count, desc, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import {
    DistributionItem,
    GeographicDistributionItem,
    UrlAnalyticsResponseDTO,
} from '@modules/analytics/DTOs';
import { UrlAccess } from '@modules/analytics/models/UrlAccess';
import { UrlAccessRepository } from '@modules/analytics/repositories/UrlAccessRepository';
import { urlAccessesTable as accesses } from '@shared/infra/db/schemas/urlAccesses';

export class DrizzleUrlAccessRepository implements UrlAccessRepository {
    constructor(private db: NodePgDatabase) {}

    async create(access: UrlAccess): Promise<void> {
        await this.db.insert(accesses).values({
            shortUrlId: access.shortUrlId,
            accessedAt: access.accessedAt,
            browser: access.browser,
            operatingSystem: access.operatingSystem,
            deviceType: access.deviceType,
            country: access.country,
            state: access.state,
            city: access.city,
        });
    }

    async getAnalytics(
        shortUrlId: number,
        page: number,
        limit: number
    ): Promise<UrlAnalyticsResponseDTO> {
        const offset = (page - 1) * limit;

        const [
            totalResult,
            history,
            browsers,
            operatingSystems,
            devices,
            geography,
        ] = await Promise.all([
            this.db
                .select({ count: count() })
                .from(accesses)
                .where(eq(accesses.shortUrlId, shortUrlId)),
            this.db
                .select({
                    id: accesses.id,
                    shortUrlId: accesses.shortUrlId,
                    accessedAt: accesses.accessedAt,
                    browser: accesses.browser,
                    operatingSystem: accesses.operatingSystem,
                    deviceType: accesses.deviceType,
                    country: accesses.country,
                    state: accesses.state,
                    city: accesses.city,
                })
                .from(accesses)
                .where(eq(accesses.shortUrlId, shortUrlId))
                .orderBy(desc(accesses.accessedAt))
                .limit(limit)
                .offset(offset),
            this.getDistribution(shortUrlId, accesses.browser),
            this.getDistribution(shortUrlId, accesses.operatingSystem),
            this.getDistribution(shortUrlId, accesses.deviceType),
            this.db
                .select({
                    country: accesses.country,
                    state: accesses.state,
                    city: accesses.city,
                    count: count(),
                })
                .from(accesses)
                .where(eq(accesses.shortUrlId, shortUrlId))
                .groupBy(accesses.country, accesses.state, accesses.city)
                .orderBy(sql`count(*) desc`),
        ]);

        const totalAccesses = totalResult[0]?.count ?? 0;

        return {
            totalAccesses,
            history: {
                items: history,
                page,
                limit,
                total: totalAccesses,
            },
            distribution: {
                browsers,
                operatingSystems,
                devices,
                geography: geography as GeographicDistributionItem[],
            },
        };
    }

    private async getDistribution(
        shortUrlId: number,
        column:
            | typeof accesses.browser
            | typeof accesses.operatingSystem
            | typeof accesses.deviceType
    ): Promise<DistributionItem[]> {
        const result = await this.db
            .select({
                value: column,
                count: count(),
            })
            .from(accesses)
            .where(eq(accesses.shortUrlId, shortUrlId))
            .groupBy(column)
            .orderBy(sql`count(*) desc`);

        return result.map((item) => ({
            value: item.value,
            count: item.count,
        }));
    }
}
