/* eslint-disable */
export default {
  displayName: 'rx-actions',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-actions',
  preset: '../../jest.preset.js',
};
