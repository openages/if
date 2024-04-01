import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
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

		x.init(props)
	}, [props])

	const props_shadow: IPropsShadow = {
		pure_nodes: $copy(x.pure_nodes),
		layout: useMemoizedFn(x.layout)
	}

	const props_graph: IPropsGraph = {
		theme: global.setting.theme,
		nodes: $copy(x.nodes),
		edges: $copy(x.edges),
		setHandlers: useMemoizedFn(x.setHandlers)
	}

	return (
		<div className={$cx('flex relative', styles._local)}>
			<Shadow {...props_shadow}></Shadow>
			<If condition={x.nodes.length > 0}>
				<ReactFlowProvider>
					<Graph {...props_graph}></Graph>
				</ReactFlowProvider>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
