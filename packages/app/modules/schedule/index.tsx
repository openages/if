import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { match, P } from 'ts-pattern'
import { container as model_container } from 'tsyringe'

import { useSensor, useSensors, DndContext, DragOverlay, PointerSensor } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'

import {
	CalendarView,
	ContextMenu,
	DateScale,
	Header,
	MonthView,
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
	IPropsMonthView,
	IPropsTimelineView,
	IPropsSettingsModal,
	IPropsScanline
} from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => model_container.resolve(Model))
	const container = useRef<HTMLDivElement>(null)
	const scanline = useRef<HTMLDivElement>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 12 } }))
	const days = $copy(x.days)
	const calendar_days = $copy(x.calendar_days)
	const timeline_angles = $copy(x.timeline_angles)
	const tags = $copy(x.setting?.setting?.tags || [])
	const timeblock_copied = $copy(x.timeblock_copied)
	const move_item = $copy(x.move_item)
	const today_index = useMemo(() => days.findIndex(item => item?.value?.isToday()), [days])

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	const scrollToScanline = useMemoizedFn(() => {
		if (!scanline.current) return

		scrollIntoView(scanline.current, { behavior: 'smooth', block: 'center' })
	})

	const addTimeBlock = useMemoizedFn(x.addTimeBlock)
	const updateTimeBlock = useMemoizedFn(x.updateTimeBlock)
	const removeTimeBlock = useMemoizedFn(x.removeTimeBlock)
	const copyTimeBlock = useMemoizedFn(v => (x.timeblock_copied = v))
	const changeTimeBlockLength = useMemoizedFn(x.changeTimeBlockLength)

	const props_header: IPropsHeader = {
		view: x.view,
		scale: x.scale,
		current: x.current,
		visible_task_panel: x.visible_task_panel,
		tags,
		filter_tags: $copy(x.filter_tags),
		step: useMemoizedFn(x.step),
		toggleVisibleTaskPanel: useMemoizedFn(() => (x.visible_task_panel = !x.visible_task_panel)),
		changeView: useMemoizedFn(x.changeView),
		changeScale: useMemoizedFn(x.changeScale),
		changeCurrent: useMemoizedFn(x.changeCurrent),
		showSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = true)),
		changeFilterTags: useMemoizedFn(v => (x.filter_tags = v))
	}

	const props_date_scale: IPropsDateScale = {
		view: x.view,
		scale: x.scale,
		days,
		show_time_scale: x.show_time_scale,
		scrollToScanline
	}

	const props_calendar_view: IPropsCalendarView = {
		container,
		calendar_days,
		tags,
		today_index,
		move_item,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	}

	const props_month_view: IPropsMonthView = {
		view: x.view,
		days,
		calendar_days,
		tags,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		jump: useMemoizedFn(x.jump)
	}

	const props_timeline_view: IPropsTimelineView = {
		container,
		days,
		setting_timeline_angles: $copy(x.setting?.setting?.['timeline_angles'] || []),
		timeline_angles,
		tags,
		move_item,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	}

	const props_settings_modal: IPropsSettingsModal = {
		visible_settings_modal: x.visible_settings_modal,
		setting: { ...$copy(x.setting?.setting), ...$copy(x.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		updateSetting: useMemoizedFn(x.updateSetting),
		removeTag: useMemoizedFn(x.removeTag),
		removeTimelineAngle: useMemoizedFn(x.removeTimelineAngle),
		removeTimelineRow: useMemoizedFn(x.removeTimelineRow),
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
						{x.show_date_scale && <DateScale {...props_date_scale}></DateScale>}
						<div
							className={$cx(
								'flex',
								styles.view_wrap,
								x.show_date_scale && styles.show_date_scale
							)}
							ref={container}
						>
							{x.show_time_scale && <TimeScale></TimeScale>}
							<div
								className={$cx(
									'border_box relative',
									styles.view,
									x.show_time_scale && styles.show_time_scale
								)}
								style={{ height: x.show_time_scale ? 1152 : 'auto' }}
							>
								{x.show_time_scale && <Scanline {...props_scanline}></Scanline>}
								{match([x.view, x.scale])
									.with(
										[P.union('calendar', 'fixed'), P.union('day', 'week')],
										() => <CalendarView {...props_calendar_view}></CalendarView>
									)
									.with([P.union('calendar', 'fixed'), 'month'], () => (
										<MonthView {...props_month_view}></MonthView>
									))
									.with(['timeline', P.union('day', 'week', 'month')], () => (
										<TimelineView {...props_timeline_view}></TimelineView>
									))
									.otherwise(null)}
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
			<ContextMenu timeblock_copied={timeblock_copied} addTimeBlock={addTimeBlock}></ContextMenu>
			<SettingsModal {...props_settings_modal}></SettingsModal>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
