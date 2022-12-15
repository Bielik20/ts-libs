/* eslint-disable */
export default {
  displayName: 'fetch-client',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/fetch-client',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
