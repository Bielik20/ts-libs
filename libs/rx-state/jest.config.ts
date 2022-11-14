/* eslint-disable */
export default {
  displayName: 'rx-state',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-state',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
