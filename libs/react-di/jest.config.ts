/* eslint-disable */
export default {
  displayName: 'react-di',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-di',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
