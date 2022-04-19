import { readProjectConfiguration, Tree, updateProjectConfiguration } from '@nrwl/devkit';

export function addSemverVersion(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  projectConfig.targets.version = {
    executor: '@jscutlery/semver:version',
    options: {
      preset: 'conventional',
      baseBranch: 'master',
      postTargets: [`${schema.project}:publish`, `${schema.project}:github`],
      commitMessageFormat: 'chore(${projectName}): release version ${version} [skip ci]',
    },
  };
  projectConfig.targets.github = {
    executor: '@jscutlery/semver:github',
    options: {
      tag: '${tag}',
      notes: '${notes}',
    },
  };

  updateProjectConfiguration(tree, schema.project, projectConfig);
}
