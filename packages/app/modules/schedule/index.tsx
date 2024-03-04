import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { match } from 'ts-pattern'
import { container as model_container } from 'tsyringe'

import { useSensor, useSensors, DndContext, DragOverlay, PointerSensor } from '@dnd-kit/core'

import { CalendarView, DateScale, Header, SettingsModal, TaskPanel, Timeline, TimelineView } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsDateScale, IPropsHeader, IPropsCalendarView, IPropsSettingsModal } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => model_container.resolve(Model))
	const container = useRef<HTMLDivElement>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const days = $copy(x.days)
	const tags = $copy(x.setting?.setting?.tags || [])
	const today_index = useMemo(() => days.findIndex(item => item.value.isToday()), [days])

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const props_header: IPropsHeader = {
		view: x.view,
		scale: x.scale,
		current: x.current,
		visible_task_panel: x.visible_task_panel,
		tags,
		filter_tags: $copy(x.filter_tags),
		step: useMemoizedFn(x.step),
		toggleVisibleTaskPanel: useMemoizedFn(() => (x.visible_task_panel = !x.visible_task_panel)),
		changeView: useMemoizedFn((v: Model['view']) => (x.view = v)),
		changeScale: useMemoizedFn((v: Model['scale']) => (x.scale = v)),
		changeCurrent: useMemoizedFn((v: Model['current']) => (x.current = v)),
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true)),
		changeFilterTags: useMemoizedFn(v => (x.filter_tags = v))
	}

	const props_date_scale: IPropsDateScale = {
		scale: x.scale,
		days
	}

	const props_calendar_view: IPropsCalendarView = {
		container,
		view: x.view,
		calendar_days: $copy(x.calendar_days),
		timeblock_copied: $copy(x.timeblock_copied),
		tags,
		today_index,
		addTimeBlock: useMemoizedFn(x.addTimeBlock),
		updateTimeBlock: useMemoizedFn(x.updateTimeBlock),
		removeTimeBlock: useMemoizedFn(x.removeTimeBlock),
		copyTimeBlock: useMemoizedFn(v => (x.timeblock_copied = v)),
		updateTodoSchedule: useMemoizedFn(x.updateTodoSchedule),
		changeTimeBlockLength: useMemoizedFn(x.changeTimeBlockLength)
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		setting: { ...$copy(x.setting?.setting), ...$copy(x.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		updateSetting: useMemoizedFn(x.updateSetting),
		removeTag: useMemoizedFn(x.removeTag)
	}

	const onDragStart = useMemoizedFn(x.onDragStart)
	const onDragMove = useMemoizedFn(x.onDragMove)
	const onDragEnd = useMemoizedFn(x.onDragEnd)

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<Header {...props_header}></Header>
			<div className={$cx('flex', styles.content)}>
				<DndContext
					onDragStart={onDragStart}
					onDragMove={onDragMove}
					onDragEnd={onDragEnd}
					sensors={sensors}
				>
					{x.visible_task_panel && <TaskPanel></TaskPanel>}
					<div
						className={$cx(
							'h_100 flex flex_column',
							styles.schedule,
							x.visible_task_panel && styles.visible_task_panel
						)}
					>
						<DateScale {...props_date_scale}></DateScale>
						<div className={$cx('flex', styles.view_wrap)} ref={container}>
							<Timeline></Timeline>
							<div className={$cx('flex', styles.view)}>
								{match(x.view)
									.with('calendar', () => (
										<CalendarView {...props_calendar_view}></CalendarView>
									))
									.with('timeline', () => <TimelineView></TimelineView>)
									.with('fixed', () => <TimelineView></TimelineView>)
									.exhaustive()}
							</div>
						</div>
					</div>
					{/* {x.active_item &&
						createPortal(
							<DragOverlay dropAnimation={null} zIndex={1001}></DragOverlay>,
							document.body
						)} */}
				</DndContext>
			</div>
			<SettingsModal {...props_settings_modal}></SettingsModal>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
