import { joinPathFragments, readProjectConfiguration, Tree, updateJson } from '@nx/devkit';

export function addCoreJsTslibAsPeerDeps(tree: Tree, options: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  updateJson(tree, joinPathFragments(projectConfig.root, 'package.json'), (json) => {
    json.peerDependencies = {
      'core-js': '^3.0.0',
      tslib: '^2.0.0',
    };

    return json;
  });
}
