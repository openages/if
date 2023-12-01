import app from './app'
import common from './common'
import components from './components'
import dirtree from './dirtree'
import layout from './layout'
import modules from './modules'
import setting from './setting'
import shortcuts from './shortcuts'
import todo from './todo'

export default ({
	translation: {
		app,
		common,
		setting,
		modules,
		layout,
		shortcuts,
		dirtree,
		components,
		todo
	}
} as const)
