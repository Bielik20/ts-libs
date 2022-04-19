import { readProjectConfiguration, Tree, updateJson } from '@nrwl/devkit';

export function addLicenceFieldToPackageJson(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  updateJson(tree, projectConfig.targets.build.options.packageJson, (json) => {
    json.license = 'MIT';

    return json;
  });
}
