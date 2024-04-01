import { useEffect } from 'react'

import { useNodes, useNodesInitialized, useReactFlow } from '@xyflow/react'

import type { IPropsLayout } from '../types'

export default (props: IPropsLayout) => {
	const { layouted, layout } = props
	const rendered = useNodesInitialized()
	const nodes = useNodes()
	const { fitView } = useReactFlow()

	useEffect(() => {
		if (!rendered) return
		if (layouted) return
		if (!nodes.length) return
		if (!nodes.at(0)?.computed?.width) return

		layout(nodes)

		window.requestAnimationFrame(() => fitView({ minZoom: 0.6 }))
	}, [rendered, nodes])

	return null
}
