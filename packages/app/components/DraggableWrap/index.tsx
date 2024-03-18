import { cloneElement } from 'react'

import { useDraggable } from '@dnd-kit/core'
import { useDeepMemo } from '@openages/stk/react'

import type { ReactElement } from 'react'

interface IProps {
	children: ReactElement
	id: string
	data: any
	disabled?: boolean
}

const Index = (props: IProps) => {
	const { children, id, data, disabled } = props
	const { attributes, listeners, transform, isDragging, setNodeRef, setActivatorNodeRef } = useDraggable({
		id,
		data,
		disabled
	})

	const draggable_props = useDeepMemo(() => {
		return { attributes, transform, isDragging, listeners, setNodeRef, setActivatorNodeRef }
	}, [attributes, transform, isDragging])

	return cloneElement(children, { draggable_props })
}

export default $app.memo(Index)
