/* eslint-disable */
export default {
  displayName: 'ts-utils',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/ts-utils',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
