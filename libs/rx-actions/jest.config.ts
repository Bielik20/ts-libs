/* eslint-disable */
export default {
  displayName: 'rx-actions',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-actions',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
