import {
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '@nrwl/workspace';
import npmGenerator from '@ns3/nx-npm/src/generators/npm/generator';
import { addCoreJsTslibAsPeerDeps } from '../../src/utils/add-corejs-tslib-as-peer-deps';
import { addLicenceFieldToPackageJson } from '../../src/utils/add-licence-field-to-package-json';
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
    babelJest: true,
  });
  await updateWorkspaceConfig(host, { project: schema.name });
  await npmGenerator(host, { project: schema.name, skipFormat: true, access: 'public' });
  await addLicenceFieldToPackageJson(host, { project: schema.name });
  await addCoreJsTslibAsPeerDeps(host, { project: schema.name });
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}

function updateWorkspaceConfig(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  projectConfig.targets.build.options.buildableProjectDepsInPackageJsonType = 'dependencies';
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
