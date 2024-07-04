import npmGenerator from '@ns3/nx-npm/src/generators/npm/generator';
import {
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';
import { addCoreJsTslibAsPeerDeps } from '../../utils/add-corejs-tslib-as-peer-deps';
import { addLicenceFieldToPackageJson } from '../../utils/add-licence-field-to-package-json';
import { Schema } from './schema';

export default async function (host: Tree, schema: Schema) {
  await libraryGenerator(host, {
    name: schema.name,
    tags: schema.tags,
    skipTsConfig: false,
    skipFormat: true,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    strict: true,
    buildable: true,
  });
  await updateWorkspaceConfig(host, { project: schema.name });
  await npmGenerator(host, { project: schema.name, skipFormat: true, access: 'public' });
  await addLicenceFieldToPackageJson(host, { project: schema.name });
  await addModuleFieldsToPackageJson(host, { project: schema.name });
  await addCoreJsTslibAsPeerDeps(host, { project: schema.name });
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}

function updateWorkspaceConfig(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  projectConfig.targets.build.options.assets = [
    ...projectConfig.targets.build.options.assets,
    {
      glob: 'LICENSE',
      input: '.',
      output: '.',
    },
  ];

  updateProjectConfiguration(tree, schema.project, projectConfig);
}

export function addModuleFieldsToPackageJson(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  updateJson(tree, projectConfig.targets.build.options.packageJson, (json) => {
    json.type = 'module';
    json.main = './src/index.js';
    json.typings = './src/index.d.ts';
    json.module = './src/index.js';
    json.exports = {
      '.': {
        types: './src/index.d.ts',
        import: './src/index.js',
      },
    };

    return json;
  });
}
