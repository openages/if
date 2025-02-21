import dayjs from 'dayjs'
import { Workbook } from 'exceljs'
import { groupBy, omit, pick } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import Utils from '@/models/utils'
import { getQuerySetting, updateSetting } from '@/services'
import { downloadExcel, getDocItem, getDocItemsData } from '@/utils'
import { confirm } from '@/utils/antd'
import { disableWatcher } from '@/utils/decorators'
import getEditorText from '@/utils/getEditorText'
import { findParent } from '@openages/stk/dom'
import { setStorageWhenChange, useInstanceWatch } from '@openages/stk/mobx'
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
	getCrossTime,
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
import type { Dayjs } from 'dayjs'

@injectable()
export default class Index {
	id = ''
	view = 'calendar' as Schedule.Item['type']
	scale = 'week' as Schedule.Item['fixed_scale']
	current = dayjs()
	days = [] as Array<DayDetail>
	disable_watcher = false

	setting = {} as Schedule.ScheduleSetting
	setting_watcher = null as unknown as Subscription
	schedule_ids = [] as Array<string>
	schedule_ids_watcher = null as unknown as Subscription
	calendar_days = [] as Schedule.CalendarDays
	calendar_days_watcher = null as unknown as Subscription
	timeline_rows = {} as Record<string, Schedule.CalendarDay>
	timeline_rows_watcher = null as unknown as Subscription

	timeblock_copied = null as unknown as Omit<Schedule.CalendarItem, 'id'>
	filter_tags = [] as Array<string>

	visible_task_panel = false
	visible_settings_modal = false
	visible_list_modal = false

	list_duration = 'day' as 'day' | 'week' | 'month' | 'year' | 'custom'
	list_current_text = dayjs().format('YYYY-MM-DD') as string
	list_current_date = dayjs()
	list_custom_duration = null as [string, string] | null
	list_items = [] as Array<Schedule.Item>

	task_panel_clear_mode = true

	move_item = null as unknown as Schedule.CalendarItem & {
		day_index?: number
		angle_index?: number
		row_index?: number
	}

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
				file: false,
				utils: false,
				id: false,
				disable_watcher: false,
				setting_watcher: false,
				schedule_ids_watcher: false,
				calendar_days_watcher: false,
				timeline_rows_watcher: false,
				list_current_date: false
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

		this.utils.acts = [
			setStorageWhenChange([{ [`${id}_view`]: 'view' }, { [`${id}_scale`]: 'scale' }], this),
			...useInstanceWatch(this)
		]

		this.id = id
		this.file.init(id)

		this.on()
		this.getDays()
	}

	changeView(v: Index['view']) {
		this.timeblock_copied = null as unknown as Index['timeblock_copied']
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
				getDayDetails(this.current.subtract(1, 'day')),
				getDayDetails(this.current),
				getDayDetails(this.current.add(1, 'day'))
			])
			.with('week', () => getWeekdays(this.current))
			.with('month', () => getMonthDays(this.current, this.view === 'fixed' || this.view === 'timeline'))
			.with('year', () => getYearDays(this.current))
			.otherwise(() => null) as unknown as Index['days']

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
		if (active.data.current!.signal === 'task_panel') return
		if (!over) return (this.move_item = null as unknown as Index['move_item'])

		const target = findParent(activatorEvent.target as HTMLElement, '.timeblock_item_wrap')

		if (!target) return

		if (this.view === 'timeline') {
			if (!over.data.current!.row_id) return

			const { step, angle_index, row_index, row_id } = over.data.current!
			const { angle_row_id, timeblock_index } = active.data.current!
			const active_item = this.timeline_rows[angle_row_id][timeblock_index]
			const total = this.scale !== 'year' ? 2 * this.days.length : this.days.length

			let start = getStartByX(container, step, target.getBoundingClientRect().left)!

			if (start < 0) start = 0
			if (start + active_item.length > total) start = total - active_item.length

			const length = collisionDetection(
				this.timeline_rows[row_id],
				start,
				active_item.length,
				active.id as string
			)

			if (!length) return (this.move_item = null as unknown as Index['move_item'])

			this.move_item = { angle_index, row_index, start, length } as Index['move_item']
		} else {
			const over_day_index =
				over?.data?.current?.signal === 'task_panel_drop_container'
					? over.data.current.day_index
					: over.id
			const { day_index: active_day_index, timeblock_index } = active.data.current!

			const active_item = this.calendar_days[active_day_index][timeblock_index]

			let start = getStartByY(container, target.getBoundingClientRect().top)!

			if (start < 0) start = 0
			if (start + active_item.length > 72) start = 72 - active_item.length

			const length = collisionDetection(
				this.calendar_days[over_day_index],
				start,
				active_item.length,
				active.id as string
			)

			if (!length) return (this.move_item = null as unknown as Index['move_item'])

			this.move_item = { day_index: over_day_index, start, length } as Index['move_item']
		}
	}

	onDragCancel() {
		this.move_item = null as unknown as Index['move_item']
	}

	jump(v: Dayjs) {
		this.scale = 'week'

		this.changeCurrent(v)
	}

	listJump(v: Dayjs, timeline?: boolean) {
		this.visible_list_modal = false

		if (timeline) {
			this.changeView('timeline')
			this.changeScale('month')
		} else {
			this.changeView('calendar')
			this.changeScale('week')
		}

		this.changeCurrent(v)
	}

	setListDuration(v?: Index['list_duration'], ignore_date?: boolean) {
		if (!ignore_date) this.list_current_date = dayjs()

		if (v) {
			this.list_duration = v
		} else {
			v = this.list_duration
		}

		if (v === 'custom') {
			this.list_items = []

			return
		}

		this.list_custom_duration = null

		this.list_current_text = match(v)
			.with('day', () => this.list_current_date.format('YYYY-MM-DD'))
			.with('week', () => this.list_current_date.format('YYYY [W]W'))
			.with('month', () => this.list_current_date.format('YYYY-MM'))
			.with('year', () => this.list_current_date.format('YYYY'))
			.exhaustive()

		const start = this.list_current_date.startOf(v).valueOf()
		const end = this.list_current_date.endOf(v).valueOf()

		this.getListItems([start, end])
	}

	listStep(type: 'prev' | 'next') {
		this.list_current_date = this.list_current_date[type === 'prev' ? 'subtract' : 'add'](
			1,
			this.list_duration as Exclude<Index['list_duration'], 'custom'>
		)

		this.setListDuration(this.list_duration, true)
	}

	setListCustomDuration(v: Index['list_custom_duration']) {
		this.list_custom_duration = v

		if (v) {
			const start = dayjs(v[0]).startOf('day').valueOf()
			const end = dayjs(v[1]).endOf('day').valueOf()

			this.getListItems([start, end])
		} else {
			this.list_items = []
		}
	}

	async exportListToExcel() {
		if (!this.list_items.length) return

		const tags = this.setting?.setting?.tags || []
		const timeline_angles = this.setting?.setting?.timeline_angles || []

		const { timeline = [], calendar = [] } = groupBy($copy(this.list_items), 'type')

		const target_items = [] as Array<{
			text: string
			tag: string
			duration: string
			cross_time: string
			belong: string
		}>

		// console.log(timeline, calendar, timeline.concat(calendar))

		timeline.concat(calendar).forEach(item => {
			const start = dayjs(item.start_time)
			const end = dayjs(item.end_time)
			const target_tag = tags.find(it => item.tag === it.id)
			const target_timeline_angle = timeline_angles.find(it => item.timeline_angle_id === it.id)

			let duration
			let cross_time

			if (item.type === 'timeline') {
				const days = end.diff(start, 'hours') / 24
				duration = `${start.format('MM.DD')} - ${end.format('MM.DD')}`
				cross_time = `${days}${$t('common.time.d')}`
			} else {
				duration = `${start.format('YYYY-MM-DD HH:mm')} - ${end.format('HH:mm')}`
				cross_time = getCrossTime(start, end)
			}

			target_items.push({
				text: item.text,
				tag: target_tag?.text || '',
				duration,
				cross_time,
				belong: target_timeline_angle?.text || ''
			})
		})

		const workbook = new Workbook()
		const worksheet = workbook.addWorksheet($t('modules.schedule'))

		const headers = (['text', 'tag', 'duration', 'cross_time', 'belong'] as const).map(i =>
			$t(`schedule.exportListToExcel.${i}`)
		)

		worksheet.addRow(headers)
		worksheet.addRows(target_items.map(item => Object.values(item)))

		headers.forEach((_, index) => {
			const column = index + 1

			let width = 12

			if (column === 1) width = 45
			if (column === 3) width = 21
			if (column === 5) width = 18

			worksheet.getColumn(column).width = width
		})

		const buffer = await workbook.xlsx.writeBuffer()

		downloadExcel(`${this.file.data.name}_${this.list_current_text}`, buffer)
	}

	async getListItems(v: [number, number]) {
		const [start, end] = v
		const selector: MangoQuerySelector<Schedule.Item> = {}

		selector['$or'] = [
			{
				start_time: { $gte: start },
				end_time: { $lte: end + 1 }
			},
			{
				start_time: { $lt: start },
				end_time: { $gt: start }
			},
			{
				start_time: { $lt: end + 1 },
				end_time: { $gt: end + 1 }
			}
		]

		const items = await getTimeBlocks(this.id, selector, []).sort({ start_time: 'desc' }).exec()

		this.list_items = getDocItemsData(items).map(item => {
			item.text = getEditorText(item.text)

			return item
		})
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
		const target_info = (info ? omit(info, ['start', 'length']) : {}) as Partial<Schedule.Item>

		if (this.view === 'fixed') target_info['fixed_scale'] = this.scale

		if (timeline) {
			const angle = this.setting.setting.timeline_angles[index]

			target_info['timeline_angle_id'] = angle.id
			target_info['timeline_angle_row_id'] = angle.rows[row_index!]

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
		const { day_index, angle_row_id, timeblock_index } = over!.data.current!

		let over_item = null as unknown as Schedule.CalendarItem

		if (this.view === 'timeline') {
			over_item = this.timeline_rows[angle_row_id][timeblock_index]
		} else {
			over_item = this.calendar_days[day_index][timeblock_index]
		}

		if (over_item.todos?.includes(active_item_id)) {
			$message.warning($t('schedule.todo_exsit'))
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
			active.data.current!.signal === 'task_panel' &&
			over?.data?.current?.signal === 'task_panel_drop_container'
		) {
			return this.addTodoToTimeblock(active, over)
		}

		if (!this.move_item) return

		const over_day_index =
			over?.data?.current?.signal === 'task_panel_drop_container' ? over.data.current.day_index : over.id

		const { day_index, angle_row_id, timeblock_index } = active.data.current!
		const { angle_id, row_id } = over.data.current || {}

		let active_item = null as unknown as Schedule.CalendarItem
		let date = null as unknown as Dayjs

		if (this.view === 'timeline') {
			if (!over.data.current!.row_id) return (this.move_item = null as unknown as Index['move_item'])

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

			this.move_item = null as unknown as Index['move_item']

			await this.updateTimeBlock(active_item.id, data)
		} else {
			if (day_index === over_day_index) {
				this.calendar_days[day_index][timeblock_index] = $copy(active_item)
			} else {
				this.calendar_days[day_index].splice(timeblock_index, 1)
				this.calendar_days[over_day_index].push($copy(active_item))
			}

			this.move_item = null as unknown as Index['move_item']

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
			const item = this.calendar_days[day_index!][timeblock_index]
			const after_length = item.length + step

			if (!after_length) return

			const target_length = collisionDetection(
				this.calendar_days[day_index!],
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
		const doc = (await $db.todo_items.findOne(id).exec())!

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
				title: $t('common.notice'),
				content: $t('common.tags.remove_confirm', { counts })
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

	async redirect(id: string) {
		const doc = (await $db.schedule_items.findOne(id).exec())!
		const target = getDocItem(doc)!
		const container = document.getElementById(this.id)!

		this.changeView(target.type)
		this.changeCurrent(dayjs(target.start_time))

		setTimeout(() => {
			const target_dom = container.querySelector(`#${id}`)

			if (!target_dom) return

			scrollIntoView(target_dom, { block: 'center', behavior: 'smooth', boundary: container })

			target_dom.classList.add('notice_text')

			setTimeout(() => {
				target_dom.classList.remove('notice_text')
			}, 1200)
		}, 300)
	}

	watchSetting() {
		this.setting_watcher = getQuerySetting(this.id).$.subscribe(setting => {
			const doc_setting = getDocItem(setting!)!
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

		const start_time = this.days.at(0)!.value.startOf('day')
		const end_time = this.days.at(-1)!.value.endOf('day')

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

			const items = getDocItemsData(doc) as Schedule.CalendarDay
			const now = dayjs()
			const target = this.days.map(_ => []) as Schedule.CalendarDays

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
					target[index].push(item)
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
		this.calendar_days_watcher = null as unknown as Index['calendar_days_watcher']
	}

	watchTimelineAngles() {
		this.stopWatchCalendarDays()
		this.stopWatchTimelineAngles()

		const now = dayjs()
		const begin = this.days[0].value.startOf('day')
		const view_start_time = this.days.at(0)!.value.startOf('day')
		const view_end_time = this.days.at(-1)!.value.endOf(this.scale !== 'year' ? 'day' : 'year')

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

				target[item.timeline_angle_row_id!].push(item)
			})

			this.timeline_rows = target
		})
	}

	stopWatchTimelineAngles() {
		if (!this.timeline_rows_watcher) return

		this.timeline_rows_watcher.unsubscribe()
		this.timeline_rows_watcher = null as unknown as Index['timeline_rows_watcher']
	}

	on() {
		this.watchSetting()
		this.watchScheduleItems()

		window.$app.Event.on(`schedule/${this.id}/redirect`, this.redirect)
	}

	off() {
		this.file.off()
		this.utils.off()

		this.setting_watcher?.unsubscribe?.()
		this.schedule_ids_watcher?.unsubscribe?.()
		this.calendar_days_watcher?.unsubscribe?.()
		this.timeline_rows_watcher?.unsubscribe?.()

		window.$app.Event.off(`schedule/${this.id}/redirect`, this.redirect)
	}
}
