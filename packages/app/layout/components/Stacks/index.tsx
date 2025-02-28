import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@/components'
import { is_win_electron } from '@/utils'
import { useSensor, useSensors, DndContext, DragOverlay, PointerSensor } from '@dnd-kit/core'
import { GearSix, House } from '@phosphor-icons/react'

import { WinActions } from '../'
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
		browser_mode,
		click,
		remove,
		update,
		move,
		resize,
		setResizing,
		observe,
		unobserve,
		showHomepage,
		showSetting
	} = props
	const [drag_view, setDragView] = useState<{ column_index: number; view_index: number; view: Stack.View }>(null!)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const { t } = useTranslation()

	useEffect(() => {
		columns.forEach(column => {
			column.views.forEach(view => {
				if (view.active) {
					$stack_offs.delete(view.id)
				}
			})
		})
	}, columns)

	useEffect(() => {
		observe()

		return () => unobserve()
	}, [])

	const onDragStart = useMemoizedFn(({ active }: DragStartEvent) => {
		const column_index = active.data.current!.column as number
		const view_index = active.data.current!.view as number

		setDragView({ column_index, view_index, view: columns[column_index].views[view_index] })
	})

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		setDragView(null!)

		move({ active, over })
	})

	const props_nav_bar: IPropsStacksNavBar = {
		columns,
		focus,
		resizing,
		browser_mode,
		click,
		remove,
		update,
		showHomepage
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
			<Choose>
				<When condition={columns.length > 0}>
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
				</When>
				<Otherwise>
					<div
						className={$cx(
							'w_100 h_100 flex flex_column justify_center align_center relative',
							styles.placeholder
						)}
					>
						<div className='drag_handler is_drag w_100 absolute z_index_10 top_0 left_0 flex justify_end'>
							<If condition={is_win_electron}>
								<WinActions></WinActions>
							</If>
						</div>
						<Logo size={96}></Logo>
						<If condition={browser_mode}>
							<div className='bottom_actions flex align_center absolute'>
								<Button
									className='btn_homepage flex justify_center align_center clickable'
									icon={<House className='icon' />}
									onClick={showHomepage}
								>
									<span className='text'>{t('layout.Homepage.title')}</span>
								</Button>
								<span className='divider'></span>
								<Button
									className='btn_homepage flex justify_center align_center clickable'
									icon={<GearSix className='icon' />}
									onClick={showSetting}
								>
									<span className='text'>{t('modules.setting')}</span>
								</Button>
							</div>
						</If>
					</div>
				</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
