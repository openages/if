import { useSortable } from '@dnd-kit/sortable'
import { useDeepMemo } from '@openages/stk'
import { Children, cloneElement, useMemo } from 'react'

import type { DraggableAttributes } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import type { Transform } from '@dnd-kit/utilities'
import type { ReactElement } from 'react'

interface IProps {
	children: ReactElement
	id: string
	data: any
}

export interface SortableProps {
	attributes: DraggableAttributes
	transform: Transform
	transition: string
	isDragging: boolean
	listeners: SyntheticListenerMap
	setNodeRef: (node: HTMLElement) => void
	setActivatorNodeRef: (element: HTMLElement) => void
}

const Index = (props: IProps) => {
	const { children, id, data } = props

	const {
		attributes,
		transform,
		transition: _transition,
		isDragging,
		listeners,
		setNodeRef,
		setActivatorNodeRef
	} = useSortable({ id, data })

	const transition = useMemo(() => {
		if (_transition === 'transform 0ms linear' || !_transition) return

		return _transition
	}, [_transition])

	const sortable_props = useDeepMemo(() => {
		return { attributes, transform, transition, isDragging, listeners, setNodeRef, setActivatorNodeRef }
	}, [attributes, transform, transition, isDragging])

	return Children.map(children, child => cloneElement(child, { sortable_props }))
}

export default $app.memo(Index)
