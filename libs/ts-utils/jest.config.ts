module.exports = {
  displayName: 'ts-utils',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/ts-utils',
  preset: '../../jest.preset.ts',
};
