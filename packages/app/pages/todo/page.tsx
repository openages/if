import { add, remove } from '@/actions/todo'
import { DirTree } from '@/components'

import type { IPropsDirTree } from '@/components'

const Index = () => {
	const props_dir_tree: IPropsDirTree = {
		module: 'todo',
		actions: {
			add,
			remove
		}
	}

	return <DirTree {...props_dir_tree}></DirTree>
}

export default $app.memo(Index)
