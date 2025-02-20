import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useRef, useState } from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { match, P } from 'ts-pattern'
import { container as model_container } from 'tsyringe'

import { useGlobal } from '@/context/app'
import { useSensor, useSensors, DndContext, PointerSensor } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'

import {
	CalendarView,
	ContextMenu,
	DateScale,
	Header,
	List,
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
	IPropsScanline,
	IPropsList
} from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => model_container.resolve(Model))
	const global = useGlobal()
	const container = useRef<HTMLDivElement>(null)
	const scanline = useRef<HTMLDivElement>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 12 } }))
	const days = $copy(x.days)
	const calendar_days = $copy(x.calendar_days)
	const timeline_rows = $copy(x.timeline_rows)
	const schedule_ids = $copy(x.schedule_ids)
	const tags = $copy(x.setting?.setting?.tags || [])
	const timeblock_copied = $copy(x.timeblock_copied)
	const move_item = $copy(x.move_item)
	const unpaid = !global.auth.is_paid_user && ['timeline', 'fixed'].includes(x.view)

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
	const jump = useMemoizedFn(x.jump)

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
		showListModal: useMemoizedFn(() => {
			x.visible_list_modal = true

			x.setListDuration()
		}),
		changeFilterTags: useMemoizedFn(v => (x.filter_tags = v))
	}

	const props_date_scale: IPropsDateScale = {
		view: x.view,
		scale: x.scale,
		days,
		show_time_scale: x.show_time_scale,
		scrollToScanline,
		jump
	}

	const props_calendar_view: IPropsCalendarView = {
		unpaid,
		container,
		days,
		calendar_days,
		tags,
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
		jump
	}

	const props_timeline_view: IPropsTimelineView = {
		unpaid,
		container,
		scale: x.scale,
		days,
		setting_timeline_angles: $copy(x.setting?.setting?.['timeline_angles'] || []),
		timeline_rows,
		tags,
		move_item,
		updateTimeBlock,
		removeTimeBlock,
		copyTimeBlock,
		changeTimeBlockLength
	}

	const props_settings_modal: IPropsSettingsModal = {
		id,
		visible_settings_modal: x.visible_settings_modal,
		setting: { ...$copy(x.setting?.setting), ...$copy(x.file.data) },
		closeSettingsModal: useMemoizedFn(() => (x.visible_settings_modal = false)),
		updateSetting: useMemoizedFn(x.updateSetting),
		removeTag: useMemoizedFn(x.removeTag),
		removeTimelineAngle: useMemoizedFn(x.removeTimelineAngle),
		removeTimelineRow: useMemoizedFn(x.removeTimelineRow),
		cleanByTime: useMemoizedFn(x.cleanByTime)
	}

	const props_list: IPropsList = {
		visible_list_modal: x.visible_list_modal,
		list_duration: x.list_duration,
		list_current_text: x.list_current_text,
		list_custom_duration: $copy(x.list_custom_duration),
		list_items: $copy(x.list_items),
		tags,
		setListDuration: useMemoizedFn(x.setListDuration),
		prev: useMemoizedFn(() => x.listStep('prev')),
		next: useMemoizedFn(() => x.listStep('next')),
		setListCustomDuration: useMemoizedFn(x.setListCustomDuration),
		jump: useMemoizedFn(x.listJump),
		onClose: useMemoizedFn(() => (x.visible_list_modal = false))
	}

	const props_scanline: IPropsScanline = {
		scanline,
		scrollToScanline
	}

	const onDragMove = useMemoizedFn(args => x.onDragMove(container.current!, args))
	const onDragEnd = useMemoizedFn(x.onDragEnd)
	const onDragCancel = useMemoizedFn(x.onDragCancel)
	const toggleTaskPanelClearMode = useMemoizedFn(() => (x.task_panel_clear_mode = !x.task_panel_clear_mode))
	const updateTodoSchedule = useMemoizedFn(x.updateTodoSchedule)

	return (
		<div className={$cx('w_100 h_100 border_box flex flex_column', styles._local)}>
			<Header {...props_header}></Header>
			<div className={$cx('flex', styles.content)}>
				<DndContext
					onDragMove={onDragMove}
					onDragEnd={onDragEnd}
					onDragCancel={onDragCancel}
					sensors={sensors}
					modifiers={x.move_item ? [restrictToFirstScrollableAncestor] : []}
				>
					{x.visible_task_panel && (
						<TaskPanel
							schedule_ids={schedule_ids}
							task_panel_clear_mode={x.task_panel_clear_mode}
							toggleTaskPanelClearMode={toggleTaskPanelClearMode}
							updateTodoSchedule={updateTodoSchedule}
						></TaskPanel>
					)}
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
									.with(
										['timeline', P.union('day', 'week', 'month', 'year')],
										() => <TimelineView {...props_timeline_view}></TimelineView>
									)
									.otherwise(() => null)}
							</div>
						</div>
					</div>
				</DndContext>
			</div>
			<ContextMenu timeblock_copied={timeblock_copied} addTimeBlock={addTimeBlock}></ContextMenu>
			<List {...props_list}></List>
			<SettingsModal {...props_settings_modal}></SettingsModal>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
