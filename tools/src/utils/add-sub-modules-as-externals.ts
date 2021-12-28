import { readJsonFile } from '@nrwl/tao/src/utils/fileutils';
import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import * as rollup from 'rollup';

/**
 * This makes it so that imports from submodules do not get bundled.
 * Examples: `lodash/*`, `rxjs/operators`, `rxjs/ajax` etc.
 */
export function addSubModulesAsExternals(options: rollup.RollupOptions): rollup.RollupOptions {
  const packageJson = readPackageJson();
  const dependencies = Object.keys(packageJson.dependencies);
  const originalExternal: (input: string) => boolean = options.external as (input: string) => boolean;
  const isSubModule = (id: string) => dependencies.some((dependency) => id.startsWith(`${dependency}/`));

  options.external = (id: string) => originalExternal(id) || isSubModule(id);

  return options;
}

function readPackageJson(): any {
  return readJsonFile(`${appRootPath}/package.json`);
}
