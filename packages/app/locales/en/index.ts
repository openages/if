import components from './components'
import dirtree from './dirtree'
import modules from './modules'
import setting from './setting'
import shortcuts from './shortcuts'
import todo from './todo'

export default {
	translation: {
		setting,
		modules,
		shortcuts,
		dirtree,
		components,
		todo
	}
} as const
