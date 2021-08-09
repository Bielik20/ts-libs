import * as bundleRollup from '@nrwl/react/plugins/bundle-rollup';
import * as rollup from 'rollup';
import { addSubModulesAsExternals } from '../utils/add-sub-modules-as-externals';

function getRollupOptions(options: rollup.RollupOptions): rollup.RollupOptions {
  // @ts-ignore
  options = bundleRollup(options); // Original nrwl react options
  options = addSubModulesAsExternals(options);

  return options;
}

module.exports = getRollupOptions;