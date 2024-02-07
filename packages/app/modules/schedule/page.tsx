import { insert, remove } from '@/actions/schedule'
import { DirTree } from '@/components'

import type { IPropsDirTree } from '@/components'

const Index = () => {
	const props_dir_tree: IPropsDirTree = {
		module: 'pomo',
		actions: {
			insert,
			remove
		},
		simple: true
	}

	return <DirTree {...props_dir_tree}></DirTree>
}

export default $app.memo(Index)
