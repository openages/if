import { insert, remove } from '@/actions/pomo'
import { DirTree } from '@/components'

import type { IPropsDirTree } from '@/components'

const Index = () => {
	const props_dir_tree: IPropsDirTree = {
		module: 'pomo',
		actions: {
			insert,
			remove
		}
	}

	return <DirTree {...props_dir_tree}></DirTree>
}

export default $app.memo(Index)
