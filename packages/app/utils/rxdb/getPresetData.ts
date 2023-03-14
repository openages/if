import { match } from 'ts-pattern'

import { getTodoDefaultData } from '@/appdata'

import type { App } from '@/types'

export default (module: App.ModuleType) => {
	return match(module)
		.with('todo', () => getTodoDefaultData())
		.otherwise(() => {})!
}
