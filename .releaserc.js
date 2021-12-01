module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    './tools/src/semantic-release',
  ],
  branches: [
    { name: 'master' },
    { name: 'develop', channel: 'beta', prerelease: 'beta' },
    {
      name: 'alpha/*',
      channel: 'alpha-${name.replace(/^alpha\\//g, "")}',
      prerelease: 'alpha-${name.replace(/^alpha\\//g, "")}',
    },
  ],
};
