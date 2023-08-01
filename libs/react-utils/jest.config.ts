/* eslint-disable */
export default {
  displayName: 'react-utils',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-utils',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
