export default {
    testEnvironment: 'node',
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    transform: {
        '^.+\\.tsx?$': ['@swc/jest'],
    },
    moduleNameMapper: {
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@infra/(.*)$': '<rootDir>/src/shared/infra/$1',
        '^@providers/(.*)$': '<rootDir>/src/shared/providers/$1',
    },
};
