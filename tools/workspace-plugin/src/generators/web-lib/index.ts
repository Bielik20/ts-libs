import npmGenerator from '@ns3/nx-npm/src/generators/npm/generator';
import {
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { Linter } from '@nx/linter';
import { libraryGenerator } from '@nx/workspace';
import { addCoreJsTslibAsPeerDeps } from '../../../../src/utils/add-corejs-tslib-as-peer-deps';
import { addLicenceFieldToPackageJson } from '../../../../src/utils/add-licence-field-to-package-json';
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

  projectConfig.targets.build = {
    executor: '@nx/web:rollup',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${projectConfig.root}`,
      tsConfig: `${projectConfig.root}/tsconfig.lib.json`,
      project: `${projectConfig.root}/package.json`,
      entryFile: `${projectConfig.sourceRoot}/index.ts`,
      external: ['tslib'],
      assets: [
        {
          glob: `${projectConfig.root}/README.md`,
          input: '.',
          output: '.',
        },
        {
          glob: 'LICENSE',
          input: '.',
          output: '.',
        },
      ],
    },
  };

  updateProjectConfiguration(tree, schema.project, projectConfig);
}
