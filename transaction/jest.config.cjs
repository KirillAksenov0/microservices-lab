/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/../tsconfig.json',
    }],
  },
  moduleNameMapper: {
    '^@lab/shared/(.*)$': '<rootDir>/../../shared/dist/$1/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
};