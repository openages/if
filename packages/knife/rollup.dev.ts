import { defineConfig } from 'rollup'
import { swc } from 'rollup-plugin-swc3'

import { node_lib, plugins, react_lib, storage_lib, types_lib } from './rollup.common'

const common_config = defineConfig({
	plugins: [...plugins, swc()]
})

export default defineConfig([
	{ ...node_lib, ...common_config },
	{ ...react_lib, ...common_config },
	{ ...storage_lib, ...common_config },
	{ ...types_lib, ...common_config }
])
