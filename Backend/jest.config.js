export default {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'utils/**/*.js',
    'routes/**/*.js',
    'tools/**/*.js',
    '!**/__tests__/**'
  ],
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {}
};
