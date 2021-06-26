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
import { Schema } from './schema';

export default async function (host: Tree, schema: Schema) {
  await libraryGenerator(host, {
    name: schema.name,
    tags: schema.tags,
    skipTsConfig: false,
    skipFormat: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    strict: true,
    buildable: true,
    babelJest: true,
  });
  await updateWorkspaceConfig(host, { project: schema.name });
  await npmGenerator(host, { project: schema.name, skipFormat: true, access: 'public' });
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}

function updateWorkspaceConfig(tree: Tree, schema: { project: string }) {
  const projectConfig = readProjectConfiguration(tree, schema.project);

  projectConfig.targets.build = {
    executor: '@nrwl/web:package',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: `dist/${projectConfig.root}`,
      tsConfig: `${projectConfig.root}/tsconfig.lib.json`,
      project: `${projectConfig.root}/package.json`,
      entryFile: `${projectConfig.sourceRoot}/index.ts`,
      external: ['tslib'],
      rollupConfig: './tools/src/plugins/web-rollup-plugin',
      assets: [
        {
          glob: `${projectConfig.root}/README.md`,
          input: '.',
          output: '.',
        },
      ],
    },
  };

  updateProjectConfiguration(tree, schema.project, projectConfig);
}