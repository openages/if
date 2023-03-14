import { match } from 'ts-pattern'

import { getTodoFileCounts } from '@/appdata'

import type { App, Todo } from '@/types'

export default (module: App.ModuleType, data: Todo.Data) => {
	return match(module)
		.with('todo', () => getTodoFileCounts(data.angles))
		.otherwise(() => 0)
}
