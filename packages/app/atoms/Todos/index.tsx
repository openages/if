import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { DraggableWrap, SortableWrap } from '@/components'
import { useDndMonitor, useSensor, useSensors, DndContext, DragOverlay, PointerSensor } from '@dnd-kit/core'
import { verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'

import styles from './index.css'
import Item from './Item'
import Model from './model'

export interface IProps {
	ids: Array<string>
	mode: 'sortable' | 'draggable' | 'view'
	dnd_data?: any
	show_placeholder?: boolean
	onChange?: (ids: Array<string>) => void
}

const Index = (props: IProps) => {
	const { ids, mode, dnd_data, show_placeholder, onChange } = props
	const [x] = useState(() => container.resolve(Model))
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const { t } = useTranslation()

	const items = $copy(x.items)

	useLayoutEffect(() => {
		x.init({ ids, mode, onChange })

		return () => x.off()
	}, [ids, mode, onChange])

	const updateTodoItem = useMemoizedFn(x.updateTodoItem)
	const changeStatus = useMemoizedFn(x.changeStatus)
	const check = useMemoizedFn(x.check)
	const remove = useMemoizedFn(x.remove)
	const onDragEnd = useMemoizedFn(x.onDragEnd)

	useDndMonitor({
		onDragStart({ active }) {
			if (x.mode !== 'draggable') return
			if (active.data.current.signal !== 'task_panel') return

			x.active_item = x.items[active.data.current.index]
		},
		onDragEnd({ active }) {
			if (x.mode !== 'draggable') return
			if (active.data.current.signal !== 'task_panel') return

			x.active_item = null
		},
		onDragCancel({ active }) {
			if (x.mode !== 'draggable') return
			if (active.data.current.signal !== 'task_panel') return

			x.active_item = null
		}
	})

	const Content = items.map((item, index) => {
		if (mode === 'sortable') {
			return (
				<SortableWrap id={item.id} data={{ index, ...dnd_data }} key={item.id}>
					<Item
						mode={mode}
						item={item}
						index={index}
						updateTodoItem={updateTodoItem}
						changeStatus={changeStatus}
						check={check}
						remove={remove}
					></Item>
				</SortableWrap>
			)
		}

		if (mode === 'draggable') {
			return (
				<DraggableWrap id={item.id} data={{ index, ...dnd_data }} key={item.id}>
					<Item
						mode={mode}
						item={item}
						index={index}
						updateTodoItem={updateTodoItem}
						changeStatus={changeStatus}
						check={check}
						remove={remove}
					></Item>
				</DraggableWrap>
			)
		}

		return (
			<Item
				mode={mode}
				item={item}
				index={index}
				updateTodoItem={updateTodoItem}
				changeStatus={changeStatus}
				check={check}
				remove={remove}
				key={item.id}
			></Item>
		)
	})

	if (show_placeholder && !ids.length) {
		return (
			<div className={$cx('w_100 pt_6 pb_6', styles.empty)}>{t('translation:atoms.Todos.placeholder')}</div>
		)
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			{mode === 'sortable' || mode === 'draggable' ? (
				mode === 'sortable' ? (
					<DndContext onDragEnd={onDragEnd} sensors={sensors}>
						<SortableContext items={items} strategy={verticalListSortingStrategy}>
							{Content}
						</SortableContext>
					</DndContext>
				) : (
					<Fragment>
						{Content}
						{mode === 'draggable' &&
							x.active_item &&
							createPortal(
								<DragOverlay dropAnimation={null} zIndex={1001}>
									<DraggableWrap id={x.active_item.id} data={{}}>
										<Item
											mode={mode}
											item={$copy(x.active_item)}
											index={0}
											overlay
											updateTodoItem={updateTodoItem}
											changeStatus={changeStatus}
											check={check}
											remove={remove}
										></Item>
									</DraggableWrap>
								</DragOverlay>,
								document.body
							)}
					</Fragment>
				)
			) : (
				Content
			)}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
