import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { match } from 'ts-pattern'
import { container as model_container } from 'tsyringe'

import { useSensor, useSensors, DndContext, DragOverlay, PointerSensor } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'

import {
	CalendarView,
	DateScale,
	Header,
	Scanline,
	SettingsModal,
	TaskPanel,
	TimelineView,
	TimeScale
} from './components'
import styles from './index.css'
import Model from './model'

import type {
	IProps,
	IPropsDateScale,
	IPropsHeader,
	IPropsCalendarView,
	IPropsSettingsModal,
	IPropsScanline
} from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => model_container.resolve(Model))
	const container = useRef<HTMLDivElement>(null)
	const scanline = useRef<HTMLDivElement>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 12 } }))
	const days = $copy(x.days)
	const tags = $copy(x.setting?.setting?.tags || [])
	const today_index = useMemo(() => days.findIndex(item => item.value.isToday()), [days])

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const scrollToScanline = useMemoizedFn(() => {
		if (!scanline.current) return

		scrollIntoView(scanline.current, { behavior: 'smooth', block: 'center' })
	})

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
		days,
		scrollToScanline
	}

	const props_calendar_view: IPropsCalendarView = {
		container,
		view: x.view,
		calendar_days: $copy(x.calendar_days),
		timeblock_copied: $copy(x.timeblock_copied),
		tags,
		today_index,
		move_item: $copy(x.move_item),
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
		removeTag: useMemoizedFn(x.removeTag),
		cleanByTime: useMemoizedFn(x.cleanByTime)
	}

	const props_scanline: IPropsScanline = {
		view: x.view,
		scanline,
		scrollToScanline
	}

	const onDragMove = useMemoizedFn(args => x.onDragMove(container.current, args))
	const onDragEnd = useMemoizedFn(x.onDragEnd)
	const onDragCancel = useMemoizedFn(x.onDragCancel)

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<Header {...props_header}></Header>
			<div className={$cx('flex', styles.content)}>
				<DndContext
					onDragMove={onDragMove}
					onDragEnd={onDragEnd}
					onDragCancel={onDragCancel}
					sensors={sensors}
					modifiers={[restrictToFirstScrollableAncestor]}
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
							<TimeScale></TimeScale>
							<div
								className={$cx('relative', styles.view)}
								style={{ height: x.view === 'timeline' ? 'auto' : 1152 }}
							>
								<Scanline {...props_scanline}></Scanline>
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
