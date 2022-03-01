module.exports = {
  globals: {
    __DEV__: true
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleDirectories: ['node_modules'],
};
