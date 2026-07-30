import { DrizzleUrlAccessRepository } from '@modules/analytics/repositories/DrizzleUrlAccessRepository';
import { UrlAccess } from '@modules/analytics/models/UrlAccess';
import { db } from '@shared/infra/db';

jest.mock('@shared/infra/db', () => ({
    db: {
        insert: jest.fn(),
        select: jest.fn(),
    },
}));

describe('DrizzleUrlAccessRepository', () => {
    let repository: DrizzleUrlAccessRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new DrizzleUrlAccessRepository(db);
    });

    it('should persist every collected access field', async () => {
        const values = jest.fn().mockResolvedValue(undefined);
        (db.insert as jest.Mock).mockReturnValue({ values });
        const accessedAt = new Date('2026-07-29T12:00:00.000Z');
        const access = UrlAccess.create({
            shortUrlId: 1,
            accessedAt,
            browser: 'Chrome',
            operatingSystem: 'Android',
            deviceType: 'mobile',
            country: 'BR',
            state: 'Mato Grosso',
            city: 'Cuiabá',
        });

        await repository.create(access);

        expect(values).toHaveBeenCalledWith({
            shortUrlId: 1,
            accessedAt,
            browser: 'Chrome',
            operatingSystem: 'Android',
            deviceType: 'mobile',
            country: 'BR',
            state: 'Mato Grosso',
            city: 'Cuiabá',
        });
    });

    it('should aggregate totals, history and distributions', async () => {
        const historyItem = {
            id: 10,
            shortUrlId: 1,
            accessedAt: new Date('2026-07-29T12:00:00.000Z'),
            browser: 'Chrome',
            operatingSystem: 'Android',
            deviceType: 'mobile' as const,
            country: 'BR',
            state: 'Mato Grosso',
            city: 'Cuiabá',
        };

        (db.select as jest.Mock)
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValue([{ count: 2 }]),
                }),
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        limit: jest.fn().mockResolvedValue([{ count: 3 }]),
                    }),
                }),
            })
            .mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        orderBy: jest.fn().mockReturnValue({
                            limit: jest.fn().mockReturnValue({
                                offset: jest
                                    .fn()
                                    .mockResolvedValue([historyItem]),
                            }),
                        }),
                    }),
                }),
            });

        for (const value of ['Chrome', 'Android', 'mobile']) {
            (db.select as jest.Mock).mockReturnValueOnce({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        groupBy: jest.fn().mockReturnValue({
                            orderBy: jest
                                .fn()
                                .mockResolvedValue([{ value, count: 2 }]),
                        }),
                    }),
                }),
            });
        }

        (db.select as jest.Mock).mockReturnValueOnce({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    groupBy: jest.fn().mockReturnValue({
                        orderBy: jest.fn().mockResolvedValue([
                            {
                                country: 'BR',
                                state: 'Mato Grosso',
                                city: 'Cuiabá',
                                count: 2,
                            },
                        ]),
                    }),
                }),
            }),
        });

        const result = await repository.getAnalytics(1, 1, 25);

        expect(result).toEqual({
            totalAccesses: 5,
            trackedAccesses: 2,
            legacyAccesses: 3,
            history: {
                items: [historyItem],
                page: 1,
                limit: 25,
                total: 2,
            },
            distribution: {
                browsers: [{ value: 'Chrome', count: 2 }],
                operatingSystems: [{ value: 'Android', count: 2 }],
                devices: [{ value: 'mobile', count: 2 }],
                geography: [
                    {
                        country: 'BR',
                        state: 'Mato Grosso',
                        city: 'Cuiabá',
                        count: 2,
                    },
                ],
            },
        });
    });
});
