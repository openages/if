import { useEffect } from 'react'

import { useNodes } from '@xyflow/react'

import type { IPropsLayout } from '../types'

export default (props: IPropsLayout) => {
	const { layout } = props
	const nodes = useNodes()

	useEffect(() => {
		if (!nodes.length) return
		if (!nodes.at(0)?.computed?.width && !nodes.at(0)?.computed?.height) return

		layout(nodes)
	}, [nodes])

	return null
}
