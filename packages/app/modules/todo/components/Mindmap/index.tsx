import { useMemoizedFn } from 'ahooks'
import { pick } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'
import { useHiddenReactflowROLoop, useMountEffect } from '@/hooks'
import { ReactFlowProvider } from '@xyflow/react'

import { Graph, Shadow } from './components'
import { Context } from './context'
import styles from './index.css'
import Model from './model'

import type { IPropsMindmap } from '../../types'
import type { IPropsShadow, IPropsGraph } from './types'
import type { IPropsContext } from './context'

const Index = (props: IPropsMindmap) => {
	const [x] = useState(() => container.resolve(Model))
	const { file_id, kanban_items, tags, angles, check, insert, update, tab, moveTo, remove, showDetailModal } = props
	const global = useGlobal()
	const unpaid = !global.auth.is_paid_user

	useHiddenReactflowROLoop()

	useMountEffect(() => {
		const keys = Object.keys(kanban_items)

		if (!angles.length) return
		if (!keys.length) return
		if (keys.some(angle_id => !kanban_items[angle_id].loaded)) return
		if (x.nodes.length) return x.getNodeEdge(props.kanban_items)

		x.init(pick(props, ['file_id', 'name', 'kanban_items']))
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

	const props_context: IPropsContext = {
		file_id,
		tags,
		angles,
		check,
		insert,
		update,
		tab,
		moveTo,
		remove,
		showDetailModal
	}

	return (
		<div className={$cx('flex relative', styles._local, unpaid && styles.unpaid)}>
			<span className='signal_wrap absolute top_0 left_0'>{x.signal}</span>
			<If condition={x.pure_nodes.length > 0}>
				{createPortal(
					<ReactFlowProvider>
						<Context.Provider value={props_context}>
							<Shadow {...props_shadow}></Shadow>
						</Context.Provider>
					</ReactFlowProvider>,
					document.body
				)}
			</If>
			<If condition={x.nodes.length > 0}>
				<ReactFlowProvider>
					<Context.Provider value={props_context}>
						<Graph {...props_graph}></Graph>
					</Context.Provider>
				</ReactFlowProvider>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
