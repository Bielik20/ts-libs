import * as rollup from 'rollup';
import { addSubModulesAsExternals } from '../utils/add-sub-modules-as-externals';

function getRollupOptions(options: rollup.RollupOptions): rollup.RollupOptions {
  options = addSubModulesAsExternals(options);

  return options;
}

module.exports = getRollupOptions;
