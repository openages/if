import { cloneElement, useMemo } from 'react'

import { useSortable } from '@dnd-kit/sortable'
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
	const {
		attributes,
		transform,
		transition: _transition,
		isDragging,
		listeners,
		setNodeRef,
		setActivatorNodeRef
	} = useSortable({ id, data, disabled })

	const transition = useMemo(() => {
		if (_transition === 'transform 0ms linear' || !_transition) return

		return _transition
	}, [_transition])

	const sortable_props = useDeepMemo(() => {
		return { attributes, transform, transition, isDragging, listeners, setNodeRef, setActivatorNodeRef }
	}, [attributes, transform, transition, isDragging])

	return cloneElement(children, { sortable_props })
}

export default $app.memo(Index)
