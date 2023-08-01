const nxPreset = require('@nx/jest/preset').default;
const esModules = [].join('|');

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
