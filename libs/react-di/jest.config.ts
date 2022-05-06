module.exports = {
  displayName: 'react-di',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-di',
  preset: '../../jest.preset.ts',
};
