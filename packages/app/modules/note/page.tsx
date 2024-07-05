import { remove } from '@/actions/note'
import { DirTree } from '@/components'

import type { IPropsDirTree } from '@/components'

const Index = () => {
	const props_dir_tree: IPropsDirTree = {
		module: 'note',
		actions: { remove }
	}

	return <DirTree {...props_dir_tree}></DirTree>
}

export default $app.memo(Index)
