export default {
  displayName: 'http-client',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/http-client',
  preset: '../../jest.preset.js',
};
