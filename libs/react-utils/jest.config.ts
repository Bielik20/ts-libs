module.exports = {
  displayName: 'react-utils',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-utils',
  preset: '../../jest.preset.ts',
};
