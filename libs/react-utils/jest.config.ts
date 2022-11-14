/* eslint-disable */
export default {
  displayName: 'react-utils',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-utils',
  preset: '../../jest.preset.js',
};
