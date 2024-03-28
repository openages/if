import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'
import { ReactFlow } from '@xyflow/react'

import { Layout, NodeChildrenItem, NodeTodoItem } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsMindmap } from '../../types'
import type { IPropsLayout } from './types'

const node_types = { TodoItem: NodeTodoItem, ChildrenItem: NodeChildrenItem }

const Index = (props: IPropsMindmap) => {
	const [x] = useState(() => container.resolve(Model))
	const { kanban_items, angles } = props
	const global = useGlobal()
	const nodes = $copy(x.nodes)
	const edges = $copy(x.edges)

	useEffect(() => {
		if (!angles.length) return
		if (Object.keys(kanban_items).some(angle_id => !kanban_items[angle_id].loaded)) return

		x.init(props)
	}, [props])

	const props_layout: IPropsLayout = {
		layouted: x.layouted,
		layout: useMemoizedFn(x.layout)
	}

	return (
		<div className={$cx('flex', styles._local, x.layouted && styles.layouted)}>
			<div className='mindmap_wrap w_100 h_100 border_box flex'>
				<ReactFlow
					className={$cx('w_100 h_100', global.setting.theme === 'dark' && 'dark')}
					minZoom={0.3}
					nodeTypes={node_types}
					nodes={nodes}
					edges={edges}
				>
					<Layout {...props_layout} />
				</ReactFlow>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
