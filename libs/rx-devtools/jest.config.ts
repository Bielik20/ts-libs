module.exports = {
  displayName: 'rx-devtools',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-devtools',
  preset: '../../jest.preset.ts',
};
