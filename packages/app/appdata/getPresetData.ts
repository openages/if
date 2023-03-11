import { match } from 'ts-pattern'

import { getTodoDefaultAngles } from '@/appdata'

import type { App } from '@/types'

export default (module: App.ModuleType) => {
	return match(module)
		.with('todo', () => getTodoDefaultAngles())
		.otherwise(() => {})
}
