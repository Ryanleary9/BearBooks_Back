/** @type {import("ts-jest").JestCOnfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'dist',
    'config.ts',
    'user.mongo.model.ts',
    'manga.mongo.model.ts',
    'user.router.ts',
    'manga.router.ts',
  ],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'app.ts',
    'routers',
    'config.ts',
    'user.mongo.model.ts',
    'manga.mongo.model.ts',
    'user.router.ts',
    'manga.router.ts',
  ],
};
