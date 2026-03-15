export default {
  verbose: true,
  // Global reporter for Sonar
  testResultsProcessor: 'jest-sonar-reporter',
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/src/**/*.test.{ts,tsx}'],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './client/tsconfig.json' }],
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/src/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', { tsconfig: './server/tsconfig.json' }],
      },
    },
  ],
};
