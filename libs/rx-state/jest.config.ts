module.exports = {
  displayName: 'rx-state',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-state',
  preset: '../../jest.preset.ts',
};
