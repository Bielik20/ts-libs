/* eslint-disable */
export default {
  displayName: 'http-client',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/http-client',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
