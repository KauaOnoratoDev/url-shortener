export default {
    testEnvironment: 'node',
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    transform: {
        '^.+\\.tsx?$': ['@swc/jest'],
    },
};
