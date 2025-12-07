module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/config/**'
    ],
    testTimeout: 10000
};