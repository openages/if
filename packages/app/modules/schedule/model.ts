import dayjs, { Dayjs } from 'dayjs'
import { omit } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import Utils from '@/models/utils'
import { getQuerySetting, updateSetting } from '@/services'
import { getDocItem, getDocItemsData } from '@/utils'
import { confirm } from '@/utils/antd'
import { disableWatcher } from '@/utils/decorators'
import { findParent } from '@openages/stk/dom'
import { useInstanceWatch } from '@openages/stk/mobx'
import { deepEqual } from '@openages/stk/react'

import {
	addTimeBlock,
	cleanByTime,
	getScheduleItems,
	getTimeBlocks,
	hangleTimeBlock,
	removeTimeBlock,
	updateTimeBlock
} from './services'
import {
	collisionDetection,
	getDayDetails,
	getMonthDays,
	getStartByX,
	getStartByY,
	getStartEnd,
	getTimelineRows,
	getWeekdays,
	getYearDays
} from './utils'

import type { SettingValues, ChangedSettingValues } from './types/model'
import type { Schedule, CleanTime } from '@/types'
import type { Watch } from '@openages/stk/mobx'
import type { DayDetail } from './utils'
import type { Subscription } from 'rxjs'
import type { DragMoveEvent, DragEndEvent } from '@dnd-kit/core'
import type { MangoQuerySelector } from 'rxdb'

@injectable()
export default class Index {
	id = ''
	view = 'calendar' as Schedule.Item['type']
	scale = 'day' as Schedule.Item['fixed_scale']
	current = dayjs()
	days = [] as Array<DayDetail>
	disable_watcher = false

	setting = {} as Schedule.ScheduleSetting
	setting_watcher = null as Subscription
	schedule_ids = [] as Array<string>
	schedule_ids_watcher = null as Subscription
	calendar_days = [] as Schedule.CalendarDays
	calendar_days_watcher = null as Subscription
	timeline_rows = {} as Record<string, Schedule.CalendarDay>
	timeline_rows_watcher = null as Subscription

	timeblock_copied = null as Omit<Schedule.CalendarItem, 'id'>
	filter_tags = [] as Array<string>

	visible_task_panel = false
	visible_settings_modal = false

	task_panel_clear_mode = true

	move_item = null as Schedule.CalendarItem & { day_index?: number; angle_index?: number; row_index?: number }

	watch = {
		filter_tags: () => {
			if (this.view === 'timeline') {
				this.watchTimelineAngles()
			} else {
				this.watchCalendarDays()
			}
		}
	} as Watch<Index>

	constructor(
		public file: File,
		public utils: Utils
	) {
		makeAutoObservable(
			this,
			{
				id: false,
				disable_watcher: false,
				setting_watcher: false,
				schedule_ids_watcher: false,
				calendar_days_watcher: false,
				timeline_rows_watcher: false
			},
			{ autoBind: true }
		)
	}

	get show_date_scale() {
		if (this.view === 'fixed' && (this.scale === 'day' || this.scale === 'month')) return false

		return true
	}

	get show_time_scale() {
		return (
			(this.view === 'calendar' || this.view === 'fixed') && (this.scale === 'day' || this.scale === 'week')
		)
	}

	init(args: { id: string }) {
		const { id } = args

		this.utils.acts = [...useInstanceWatch(this)]
		this.id = id
		this.file.init(id)

		this.on()
		this.getDays()
	}

	changeView(v: Index['view']) {
		this.timeblock_copied = null
		this.current = v === 'fixed' ? dayjs('1970-1-1') : dayjs()

		if (this.view === 'timeline' && this.scale === 'year') this.scale = 'day'

		this.view = v

		this.getDays()
	}

	changeScale(v: Index['scale']) {
		this.scale = v

		this.getDays()
	}

	changeCurrent(v: Index['current']) {
		this.current = v

		this.getDays()
	}

	step(type: 'prev' | 'next') {
		this.current = this.current[type === 'prev' ? 'subtract' : 'add'](1, this.scale)

		this.getDays()
	}

	getDays() {
		this.days = match(this.scale)
			.with('day', () => [
				getDayDetails(this.current),
				getDayDetails(this.current.add(1, 'day')),
				getDayDetails(this.current.add(2, 'day'))
			])
			.with('week', () => getWeekdays(this.current))
			.with('month', () => getMonthDays(this.current, this.view === 'fixed' || this.view === 'timeline'))
			.with('year', () => getYearDays(this.current))
			.otherwise(() => null)

		if (this.view === 'timeline') {
			if (!this.setting?.setting?.timeline_angles) return

			this.timeline_rows = getTimelineRows(this.setting.setting.timeline_angles)
			this.watchTimelineAngles()
		} else {
			this.calendar_days = this.days.map(_ => [])
			this.watchCalendarDays()
		}
	}

	onDragMove(container: HTMLDivElement, { active, over, activatorEvent }: DragMoveEvent) {
		if (active.data.current.signal === 'task_panel') return
		if (!over) return (this.move_item = null)

		const target = findParent(activatorEvent.target as HTMLElement, '.timeblock_item_wrap')

		if (!target) return

		if (this.view === 'timeline') {
			if (!over.data.current.row_id) return

			const { step, angle_index, row_index, row_id } = over.data.current
			const { angle_row_id, timeblock_index } = active.data.current
			const active_item = this.timeline_rows[angle_row_id][timeblock_index]
			const total = this.scale !== 'year' ? 2 * this.days.length : this.days.length

			let start = getStartByX(container, step, target.getBoundingClientRect().left)

			if (start < 0) start = 0
			if (start + active_item.length > total) start = total - active_item.length

			const length = collisionDetection(
				this.timeline_rows[row_id],
				start,
				active_item.length,
				active.id as string
			)

			if (!length) return (this.move_item = null)

			this.move_item = { angle_index, row_index, start, length } as Index['move_item']
		} else {
			const over_day_index =
				over?.data?.current?.signal === 'task_panel_drop_container'
					? over.data.current.day_index
					: over.id
			const { day_index: active_day_index, timeblock_index } = active.data.current

			const active_item = this.calendar_days[active_day_index][timeblock_index]

			let start = getStartByY(container, target.getBoundingClientRect().top)

			if (start < 0) start = 0
			if (start + active_item.length > 72) start = 72 - active_item.length

			const length = collisionDetection(
				this.calendar_days[over_day_index],
				start,
				active_item.length,
				active.id as string
			)

			if (!length) return (this.move_item = null)

			this.move_item = { day_index: over_day_index, start, length } as Index['move_item']
		}
	}

	onDragCancel() {
		this.move_item = null
	}

	jump(v: Dayjs) {
		this.current = v
		this.scale = 'day'

		this.getDays()
	}

	async addTimeBlock(args: {
		index: number
		start: number
		length: number
		info?: Omit<Schedule.CalendarItem, 'id'>
		row_index?: number
		overflow?: boolean
	}) {
		const { index, row_index, start, length, info, overflow } = args
		const timeline = this.view === 'timeline'
		const year_scale = this.scale === 'year'
		const date = this.days[timeline ? 0 : index].value
		const target_length = info?.length && !overflow ? info.length : length
		const { start_time, end_time } = getStartEnd(date, start, target_length, timeline, year_scale)
		const target_info = info ? omit(info, ['start', 'length']) : {}

		if (this.view === 'fixed') target_info['fixed_scale'] = this.scale

		if (timeline) {
			const angle = this.setting.setting.timeline_angles[index]

			target_info['timeline_angle_id'] = angle.id
			target_info['timeline_angle_row_id'] = angle.rows[row_index]

			if (this.scale === 'year') target_info['timeline_year'] = true
		}

		await addTimeBlock(this.id, {
			...target_info,
			type: this.view,
			start_time,
			end_time
		})
	}

	async updateTimeBlock(id: string, v: Partial<Schedule.Item>) {
		await updateTimeBlock(id, v)
	}

	async removeTimeBlock(id: string) {
		await removeTimeBlock(id)
	}

	async addTodoToTimeblock(active: DragEndEvent['active'], over: DragEndEvent['over']) {
		const active_item_id = active.id as string
		const { day_index, angle_row_id, timeblock_index } = over.data.current

		let over_item = null as Schedule.CalendarItem

		if (this.view === 'timeline') {
			over_item = this.timeline_rows[angle_row_id][timeblock_index]
		} else {
			over_item = this.calendar_days[day_index][timeblock_index]
		}

		if (over_item.todos?.includes(active_item_id)) {
			$message.warning($t('translation:schedule.todo_exsit'))
		} else {
			const todos = [...(over_item.todos || []), active_item_id]

			over_item.todos = todos

			await this.updateTimeBlock(over_item.id, { todos: $copy(todos) })

			if (this.task_panel_clear_mode) await this.updateTodoSchedule(active_item_id)
		}
	}

	@disableWatcher
	async onDragEnd({ active, over }: DragEndEvent) {
		if (over?.id === undefined) return

		if (
			active.data.current.signal === 'task_panel' &&
			over?.data?.current?.signal === 'task_panel_drop_container'
		) {
			return this.addTodoToTimeblock(active, over)
		}

		if (!this.move_item) return

		const over_day_index =
			over?.data?.current?.signal === 'task_panel_drop_container' ? over.data.current.day_index : over.id

		const { day_index, angle_row_id, timeblock_index } = active.data.current
		const { angle_id, row_id } = over.data.current || {}

		let active_item = null as Schedule.CalendarItem
		let date = null as Dayjs

		if (this.view === 'timeline') {
			if (!over.data.current.row_id) return (this.move_item = null)

			active_item = this.timeline_rows[angle_row_id][timeblock_index]
			date = this.days[0].value
		} else {
			active_item = this.calendar_days[day_index][timeblock_index]
			date = this.days[over_day_index].value
		}

		const { start_time, end_time } = getStartEnd(
			date,
			this.move_item.start,
			this.move_item.length,
			this.view === 'timeline',
			this.scale === 'year'
		)

		active_item.start = this.move_item.start
		active_item.length = this.move_item.length
		active_item.start_time = start_time
		active_item.end_time = end_time

		if (this.view !== 'fixed' && this.show_time_scale) {
			active_item.past = dayjs().valueOf() >= active_item.end_time
		}

		if (this.view === 'timeline') {
			const data = { start_time, end_time } as Partial<Schedule.Item>

			if (angle_row_id === row_id) {
				this.timeline_rows[angle_row_id][timeblock_index] = $copy(active_item)
			} else {
				active_item.timeline_angle_id = angle_id
				active_item.timeline_angle_row_id = row_id

				data['timeline_angle_id'] = angle_id
				data['timeline_angle_row_id'] = row_id

				this.timeline_rows[angle_row_id].splice(timeblock_index, 1)
				this.timeline_rows[row_id].push($copy(active_item))
			}

			this.move_item = null

			await this.updateTimeBlock(active_item.id, data)
		} else {
			if (day_index === over_day_index) {
				this.calendar_days[day_index][timeblock_index] = $copy(active_item)
			} else {
				this.calendar_days[day_index].splice(timeblock_index, 1)
				this.calendar_days[over_day_index].push($copy(active_item))
			}

			this.move_item = null

			await this.updateTimeBlock(active_item.id, { start_time, end_time })
		}
	}

	async changeTimeBlockLength(args: {
		day_index?: number
		angle_row_id?: string
		timeblock_index: number
		step: number
	}) {
		const { day_index, angle_row_id, timeblock_index, step } = args
		const timeline = angle_row_id !== undefined

		if (timeline) {
			const item = this.timeline_rows[angle_row_id][timeblock_index]
			const after_length = item.length + step

			if (!after_length) return

			const target_length = collisionDetection(
				this.timeline_rows[angle_row_id],
				item.start,
				after_length,
				item.id
			)

			if (!target_length) return

			item.length = target_length

			if (this.scale !== 'year') {
				item.end_time = dayjs(item.start_time)
					.add(item.length * 12, 'hours')
					.valueOf()
			} else {
				item.end_time = dayjs(item.start_time).add(item.length, 'month').valueOf()
			}

			this.updateTimeBlock(item.id, { end_time: item.end_time })
		} else {
			const item = this.calendar_days[day_index][timeblock_index]
			const after_length = item.length + step

			if (!after_length) return

			const target_length = collisionDetection(
				this.calendar_days[day_index],
				item.start,
				after_length,
				item.id
			)

			if (!target_length) return

			item.length = target_length
			item.end_time = dayjs(item.start_time)
				.add(item.length * 20, 'minutes')
				.valueOf()

			this.updateTimeBlock(item.id, { end_time: item.end_time })
		}
	}

	async updateTodoSchedule(id: string) {
		const doc = await $db.todo_items.findOne(id).exec()

		if (!doc.schedule) return

		await doc.updateCRDT({ ifMatch: { $unset: { schedule: false } } })
	}

	async updateSetting(changed_values: ChangedSettingValues, values: SettingValues) {
		await updateSetting({ file_id: this.id, setting: this.setting, changed_values, values })
	}

	async confirm(counts: number) {
		if (counts > 0) {
			const res = await confirm({
				id: this.id,
				title: $t('translation:common.notice'),
				// @ts-ignore
				content: $t('translation:common.tags.remove_confirm', { counts })
			})

			if (!res) return false
		}

		return true
	}

	async removeTag(tag: string) {
		const counts = (await hangleTimeBlock(this.id, { type: 'counts', tag })) as number
		const res = await this.confirm(counts)

		if (!res) return false

		await hangleTimeBlock(this.id, { type: 'remove', tag })

		return true
	}

	async removeTimelineAngle(angle_id: string) {
		const counts = (await hangleTimeBlock(this.id, { type: 'counts', angle_id })) as number
		const res = await this.confirm(counts)

		if (!res) return false

		await hangleTimeBlock(this.id, { type: 'remove', angle_id })

		return true
	}

	async removeTimelineRow(angle_id: string, row_id: string) {
		const counts = (await hangleTimeBlock(this.id, { type: 'counts', angle_id, row_id })) as number
		const res = await this.confirm(counts)

		if (!res) return false

		await hangleTimeBlock(this.id, { type: 'remove', angle_id, row_id })

		return true
	}

	async cleanByTime(v: CleanTime) {
		await cleanByTime(this.id, v)
	}

	watchSetting() {
		this.setting_watcher = getQuerySetting(this.id).$.subscribe(setting => {
			const doc_setting = getDocItem(setting)
			const current_setting = JSON.parse(doc_setting.setting)
			const prev_setting = $copy(this.setting)

			this.setting = { ...omit(doc_setting, 'setting'), setting: current_setting }

			if (
				this.view === 'timeline' &&
				!deepEqual(prev_setting?.setting?.timeline_angles, current_setting.timeline_angles)
			) {
				this.getDays()
			}
		})
	}

	watchScheduleItems() {
		this.schedule_ids_watcher = getScheduleItems().$.subscribe(items => {
			this.schedule_ids = getDocItemsData(items).map(item => item.id)
		})
	}

	watchCalendarDays() {
		this.stopWatchTimelineAngles()
		this.stopWatchCalendarDays()

		const start_time = this.days.at(0).value.startOf('day')
		const end_time = this.days.at(-1).value.endOf('day')

		const selector: MangoQuerySelector<Schedule.Item> = {}

		if (this.view === 'fixed') {
			selector['fixed_scale'] = this.scale
		} else {
			selector['start_time'] = { $gte: start_time.valueOf() }
			selector['end_time'] = { $lte: end_time.valueOf() + 1 }
		}

		this.calendar_days_watcher = getTimeBlocks(
			this.id,
			{ type: this.view, ...selector },
			this.filter_tags
		).$.subscribe(doc => {
			if (this.disable_watcher) return

			const items = getDocItemsData(doc)
			const now = dayjs()
			const target = this.days.map(_ => [])

			items.forEach(item => {
				const start_time = dayjs(item.start_time)
				const end_time = dayjs(item.end_time)
				const begin = dayjs(item.start_time).startOf('day')
				const date = start_time.format('YYYY-MM-DD')
				const index = this.days.findIndex(day => day.value.format('YYYY-MM-DD') === date)

				item['start'] = start_time.diff(begin, 'minutes') / 20
				item['length'] = end_time.diff(start_time, 'minutes') / 20

				if (this.view !== 'fixed' && this.show_time_scale) {
					item['past'] = now.valueOf() >= item.end_time
				}

				if (index !== -1) {
					target[index].push(item as Schedule.CalendarItem)
				} else {
					target[index] = []
				}
			})

			this.calendar_days = target
		})
	}

	stopWatchCalendarDays() {
		if (!this.calendar_days_watcher) return

		this.calendar_days_watcher.unsubscribe()
		this.calendar_days_watcher = null
	}

	watchTimelineAngles() {
		this.stopWatchCalendarDays()
		this.stopWatchTimelineAngles()

		const now = dayjs()
		const begin = this.days[0].value.startOf('day')
		const view_start_time = this.days.at(0).value.startOf('day')
		const view_end_time = this.days.at(-1).value.endOf(this.scale !== 'year' ? 'day' : 'year')

		const selector: MangoQuerySelector<Schedule.Item> = {}

		if (this.scale !== 'year') {
			selector['$or'] = [
				{
					start_time: { $gte: view_start_time.valueOf() },
					end_time: { $lte: view_end_time.valueOf() + 1 }
				},
				{
					start_time: { $lt: view_start_time.valueOf() },
					end_time: { $gt: view_start_time.valueOf() }
				},
				{
					start_time: { $lt: view_end_time.valueOf() + 1 },
					end_time: { $gt: view_end_time.valueOf() + 1 }
				}
			]
		} else {
			selector['timeline_year'] = true
			selector['start_time'] = { $gte: this.current.startOf('year').valueOf() }
			selector['end_time'] = { $lte: this.current.endOf('year').valueOf() + 1 }
		}

		this.timeline_rows_watcher = getTimeBlocks(
			this.id,
			{ type: this.view, ...selector },
			this.filter_tags
		).$.subscribe(doc => {
			if (this.disable_watcher) return

			const items = getDocItemsData(doc) as Schedule.CalendarDay
			const target = getTimelineRows(this.setting.setting.timeline_angles)

			items.forEach(item => {
				if (item.start_time < view_start_time.valueOf()) {
					item['raw_start_time'] = item.start_time
					item.start_time = view_start_time.valueOf()
				}
				if (item.end_time > view_end_time.valueOf()) {
					item['raw_end_time'] = item.end_time
					item.end_time = view_end_time.valueOf() + 1
				}

				const start_time = dayjs(item.start_time)
				const end_time = dayjs(item.end_time)

				if (this.scale !== 'year') {
					item['start'] = start_time.diff(begin, 'hours') / 12
					item['length'] = end_time.diff(start_time, 'hours') / 12
				} else {
					item['start'] = start_time.diff(begin, 'month')
					item['length'] = end_time.diff(start_time, 'month')
				}

				item['past'] = now.valueOf() >= item.end_time

				target[item.timeline_angle_row_id].push(item)
			})

			this.timeline_rows = target
		})
	}

	stopWatchTimelineAngles() {
		if (!this.timeline_rows_watcher) return

		this.timeline_rows_watcher.unsubscribe()
		this.timeline_rows_watcher = null
	}

	on() {
		this.watchSetting()
		this.watchScheduleItems()
	}

	off() {
		this.file.off()
		this.utils.off()

		this.setting_watcher?.unsubscribe?.()
		this.schedule_ids_watcher?.unsubscribe?.()
		this.calendar_days_watcher?.unsubscribe?.()
		this.timeline_rows_watcher?.unsubscribe?.()
	}
}
