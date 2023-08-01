/* eslint-disable */
export default {
  displayName: 'rx-devtools',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-devtools',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
