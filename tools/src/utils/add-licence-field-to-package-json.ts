import { joinPathFragments, readProjectConfiguration, Tree, updateJson } from '@nrwl/devkit';

export function addLicenceFieldToPackageJson(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  updateJson(tree, joinPathFragments(projectConfig.root, 'package.json'), (json) => {
    json.license = 'MIT';

    return json;
  });
}
