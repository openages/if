import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'

import { Logo } from '@/components'
import { useSensor, useSensors, DndContext, DragOverlay, PointerSensor } from '@dnd-kit/core'

import { Content, NavBar, View } from './components'
import styles from './index.css'

import type { Stack } from '@/types'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { IPropsStacks, IPropsStacksContent, IPropsStacksNavBar } from '../../types'

const Index = (props: IPropsStacks) => {
	const {
		columns,
		focus,
		container_width,
		resizing,
		click,
		remove,
		update,
		move,
		resize,
		setResizing,
		observe,
		unobserve
	} = props
	const [drag_view, setDragView] = useState<{ column_index: number; view_index: number; view: Stack.View }>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

	useEffect(() => {
		observe()

		return () => unobserve()
	}, [])

	const onDragStart = useMemoizedFn(({ active }: DragStartEvent) => {
		const column_index = active.data.current.column as number
		const view_index = active.data.current.view as number

		setDragView({ column_index, view_index, view: columns[column_index].views[view_index] })
	})

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		setDragView(null)

		move({ active, over })
	})

	const props_nav_bar: IPropsStacksNavBar = {
		columns,
		focus,
		resizing,
		click,
		remove,
		update
	}

	const props_content: IPropsStacksContent = {
		columns,
		container_width,
		resizing,
		click,
		resize,
		setResizing
	}

	return (
		<div id='stacks_container' className={$cx('w_100 h_100vh border_box flex flex_column', styles._local)}>
			<If condition={columns.length}>
				<Then>
					<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
						<NavBar {...props_nav_bar}></NavBar>
						<Content {...props_content}></Content>
						<DragOverlay dropAnimation={null}>
							{drag_view && (
								<View
									column_index={drag_view.column_index}
									view_index={drag_view.view_index}
									view={drag_view.view}
									drag_overlay
									{...{ focus, click, remove, update }}
								></View>
							)}
						</DragOverlay>
					</DndContext>
				</Then>
				<Else>
					<div className={'w_100 h_100 flex justify_center align_center'}>
						<Logo size={96}></Logo>
					</div>
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
