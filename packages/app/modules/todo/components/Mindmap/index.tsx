import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'
import { useHiddenReactflowROLoop } from '@/hooks'
import { ReactFlowProvider } from '@xyflow/react'

import { Graph, Shadow } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsMindmap } from '../../types'
import type { IPropsShadow, IPropsGraph } from './types'

const Index = (props: IPropsMindmap) => {
	const [x] = useState(() => container.resolve(Model))
	const { kanban_items, angles } = props
	const global = useGlobal()

	useHiddenReactflowROLoop()

	useLayoutEffect(() => {
		if (!angles.length) return
		if (Object.keys(kanban_items).some(angle_id => !kanban_items[angle_id].loaded)) return
		if (x.nodes.length) return x.getNodeEdge(props.kanban_items)

		x.init(props)
	}, [props])

	const props_shadow: IPropsShadow = {
		pure_nodes: $copy(x.pure_nodes),
		layout: useMemoizedFn(x.layout),
		setHandlers: useMemoizedFn(v => (x.shadow_handlers = v))
	}

	const props_graph: IPropsGraph = {
		theme: global.setting.theme,
		nodes: $copy(x.nodes),
		edges: $copy(x.edges),
		setHandlers: useMemoizedFn(v => (x.graph_handlers = v))
	}

	return (
		<div className={$cx('flex relative', styles._local)}>
			<span className='signal_wrap absolute top_0 left_0'>{x.signal}</span>
			<If condition={x.pure_nodes.length > 0}>
				{/* <ReactFlowProvider>
					<Shadow {...props_shadow}></Shadow>
				</ReactFlowProvider> */}
				{createPortal(
					<ReactFlowProvider>
						<Shadow {...props_shadow}></Shadow>
					</ReactFlowProvider>,
					document.body
				)}
			</If>
			<If condition={x.nodes.length > 0}>
				<ReactFlowProvider>
					<Graph {...props_graph}></Graph>
				</ReactFlowProvider>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
