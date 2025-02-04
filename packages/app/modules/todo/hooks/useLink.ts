import { useDrag, useDrop } from 'ahooks'
import { useRef, useState } from 'react'

import type { IPropsTodoItem } from '../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	dimension_id: IPropsTodoItem['dimension_id']
	makeLinkLine: IPropsTodoItem['makeLinkLine']
	updateRelations: IPropsTodoItem['updateRelations']
}

export default (args: HookArgs) => {
	const { item, dimension_id, makeLinkLine, updateRelations } = args
	const { id, status } = item
	const linker = useRef<HTMLDivElement>(null)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)

	useDrag(id, linker, {
		onDragStart: () => {
			if (status !== 'unchecked') return

			setDragging(true)
		},
		onDragEnd: () => {
			setDragging(false)
			makeLinkLine!(null)
		}
	})

	useDrop(linker, {
		onDom: (active_id: string, e) => {
			if (status !== 'unchecked') return

			const over = e?.target as HTMLDivElement
			const over_id = over.getAttribute('data-id')

			if (active_id === over_id) return

			updateRelations!(active_id, id, dimension_id)
			setHovering(false)
		},
		onDragEnter: () => {
			if (status !== 'unchecked') return

			setHovering(true)
		},
		onDragLeave: () => setHovering(false)
	})

	return { linker, dragging, hovering }
}
