module.exports = {
  displayName: 'rx-actions',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/rx-actions',
  preset: '../../jest.preset.ts',
};
