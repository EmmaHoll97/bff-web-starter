export default {
  verbose: true,
  // Global reporter for Sonar
  testResultsProcessor: 'jest-sonar-reporter',
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/src/**/*.test.{js,jsx}'],
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/src/**/*.test.js'],
    },
  ],
};
