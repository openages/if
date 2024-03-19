import { Graph } from '@antv/x6'

import Children from '../../Children'
import TodoItem from '../../TodoItem'
import { useHandlers } from '../../TodoItem/hooks'

import type { IPropsMindmap, IPropsTodoItem, IPropsChildren } from '@/modules/todo/types'
import type { ReactShape } from '@antv/x6-react-shape'
import type { Todo } from '@/types'

export default (
	args: Pick<
		IPropsMindmap,
		| 'tags'
		| 'angles'
		| 'check'
		| 'insert'
		| 'update'
		| 'tab'
		| 'moveTo'
		| 'remove'
		| 'handleOpenItem'
		| 'showDetailModal'
	>
) => {
	Graph.registerNode(
		'todo_item',
		{
			inherit: 'react-shape',
			component: (node: ReactShape) => {
				const data = node.getData() as Pick<IPropsTodoItem, 'item' | 'index'>

				return <TodoItem {...data} {...args} />
			}
		},
		true
	)

	Graph.registerNode(
		'children',
		{
			inherit: 'react-shape',
			component: (node: ReactShape) => {
				const { check, insert, update, tab } = args
				const data = node.getData() as Pick<
					IPropsChildren,
					'items' | 'index' | 'dimension_id' | 'ChildrenContextMenu'
				> & { item: Todo.Todo }

				const { insertChildren, removeChildren } = useHandlers({
					item: data.item,
					index: data.index,
					kanban_mode: 'angle',
					dimension_id: data.dimension_id,
					check,
					insert,
					update,
					tab
				})

				return <Children open {...data} {...{ update, tab, insertChildren, removeChildren }} />
			}
		},
		true
	)
}
