import {
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '@nrwl/react';
import npmGenerator from '@ns3/nx-npm/src/generators/npm/generator';
import { addCoreJsTslibAsPeerDeps } from '../../src/utils/add-corejs-tslib-as-peer-deps';
import { Schema } from './schema';

export default async function (host: Tree, schema: Schema) {
  await libraryGenerator(host, {
    name: schema.name,
    style: schema.style,
    tags: schema.tags,
    skipTsConfig: false,
    skipFormat: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    strict: true,
    publishable: true,
    importPath: `@ns3/${schema.name}`,
  });
  await updateWorkspaceConfig(host, { project: schema.name });
  await npmGenerator(host, { project: schema.name, skipFormat: true, access: 'public' });
  await addCoreJsTslibAsPeerDeps(host, { project: schema.name });
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}

function updateWorkspaceConfig(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  projectConfig.targets.build.options.rollupConfig = './tools/src/plugins/react-rollup-plugin';
  projectConfig.targets.build.options.external = [...projectConfig.targets.build.options.external, "tslib"];

  updateProjectConfiguration(tree, schema.project, projectConfig);
}
