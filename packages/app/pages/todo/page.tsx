import { getRefs, add, remove, update } from '@/actions/todo'
import { DirTree } from '@/components'

import type { IPropsDirTree } from '@/components'

const Index = () => {
	const props_dir_tree: IPropsDirTree = {
		module: 'todo',
		actions: {
			getRefs,
			add,
			remove,
			update
		}
	}

	return <DirTree {...props_dir_tree}></DirTree>
}

export default $app.memo(Index)
