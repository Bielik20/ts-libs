import * as bundleRollup from '@nrwl/react/plugins/bundle-rollup';
import { readJsonFile } from '@nrwl/workspace';
import { appRootPath } from '@nrwl/workspace/src/utilities/app-root';
import * as rollup from 'rollup';

function getRollupOptions(options: rollup.RollupOptions): rollup.RollupOptions {
  // @ts-ignore
  options = bundleRollup(options); // Original nrwl react options
  options = addSubModulesAsExternals(options);

  return options;
}

/**
 * This makes it so that imports from submodules do not get bundled.
 * Examples: `lodash/*`, `rxjs/operators`, `rxjs/ajax` etc.
 */
function addSubModulesAsExternals(options: rollup.RollupOptions): rollup.RollupOptions {
  const packageJson = readPackageJson();
  const dependencies = Object.keys(packageJson.dependencies);
  const originalExternal: (input: string) => boolean = options.external as (input: string) => boolean;
  const isSubModule = (id: string) => dependencies.some((dependency) => id.startsWith(`${dependency}/`));

  options.external = (id: string) => originalExternal(id) || isSubModule(id);

  return options;
}

export function readPackageJson(): any {
  return readJsonFile(`${appRootPath}/package.json`);
}


module.exports = getRollupOptions;
