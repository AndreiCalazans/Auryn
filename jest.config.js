module.exports = {
  preset: '@youi/react-native-youi',
  transform: {
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(jest-)?react-native|react-navigation|@youi)'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/appium-tests/',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  cacheDirectory: '.jest/cache',
  globals: {
    'ts-jest': {
      'useBabelrc': true,
    },
  },
};
