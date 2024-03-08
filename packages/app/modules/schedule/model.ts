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
import { useInstanceWatch } from '@openages/stk/mobx'

import {
	addTimeBlock,
	cleanByTime,
	getTagTimeBlockCounts,
	getTimeBlocks,
	removeTag,
	removeTimeBlock,
	updateTimeBlock
} from './services'
import { collisionDetection, getDayDetails, getMonthDays, getStartByY, getStartEnd, getWeekdays } from './utils'

import type { Scale, SettingValues, ChangedSettingValues } from './types/model'
import type { Schedule, CleanTime } from '@/types'
import type { Watch } from '@openages/stk/mobx'
import type { DayDetail } from './utils'
import type { Subscription } from 'rxjs'
import type { DragMoveEvent, DragEndEvent } from '@dnd-kit/core'

@injectable()
export default class Index {
	id = ''
	view = 'calendar' as Schedule.Item['type']
	scale = 'day' as Scale
	current = dayjs()
	days = [] as Array<DayDetail>
	disable_watcher = false

	setting = {} as Schedule.ScheduleSetting
	setting_watcher = null as Subscription
	calendar_days = [] as Schedule.CalendarDays
	calendar_days_watcher = null as Subscription

	timeblock_copied = null as Omit<Schedule.CalendarItem, 'id'>
	filter_tags = [] as Array<string>

	visible_task_panel = false
	visible_settings_modal = false

	move_item = null as Schedule.CalendarItem & { day_index: number }

	watch = {
		'scale|current': () => this.getDays(),
		filter_tags: () => this.watchCalendarDays()
	} as Watch<Index & { 'scale|current': any }>

	constructor(
		public utils: Utils,
		public file: File
	) {
		makeAutoObservable(
			this,
			{
				disable_watcher: false,
				setting_watcher: false,
				calendar_days_watcher: false
			},
			{ autoBind: true }
		)
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

	getDays() {
		this.days = match(this.scale)
			.with('day', () => [getDayDetails(this.current)])
			.with('week', () => getWeekdays(this.current))
			.with('month', () => getMonthDays(this.current))
			.exhaustive()

		this.watchCalendarDays()
	}

	step(type: 'prev' | 'next') {
		this.current = this.current[type === 'prev' ? 'subtract' : 'add'](1, this.scale)
	}

	onDragMove(container: HTMLDivElement, { active, over, activatorEvent }: DragMoveEvent) {
		if (!over) return

		let target = activatorEvent.target as Element

		while (!target?.classList?.contains('timeblock_item_wrap')) {
			target = target.parentElement
		}

		const day_index = over.id
		const active_item = this.calendar_days[active.data.current.day_index][active.data.current.timeblock_index]

		let start = getStartByY(container, target.getBoundingClientRect().top)

		if (start < 0) start = 0
		if (start + active_item.length > 72) start = 72 - active_item.length

		const length = collisionDetection(
			this.calendar_days[day_index],
			start,
			active_item.length,
			active.id as string
		)

		if (!length) return (this.move_item = null)

		this.move_item = { day_index, start, length } as Index['move_item']
	}

	onDragCancel() {
		this.move_item = null
	}

	jump(v: Dayjs) {
		this.current = v
		this.scale = 'day'
	}

	async addTimeBlock(args: {
		type: Schedule.Item['type']
		index: number
		start: number
		length: number
		info?: Omit<Schedule.Item, 'id'>
	}) {
		const { type, index, start, length, info } = args
		const date = this.days[index].value
		const { start_time, end_time } = getStartEnd(date, start, length)
		const target_info = info ? omit(info, ['start', 'length']) : {}

		await addTimeBlock(this.id, {
			type,
			...target_info,
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

	async pasteTimeBlock(args: {
		type: Schedule.Item['type']
		index: number
		start: number
		length: number
		info: Omit<Schedule.Item, 'id'>
	}) {
		const { type, index, start, length, info } = args

		this.addTimeBlock({ type, index, start, length, info })
	}

	@disableWatcher
	async onDragEnd({ active, over }: DragEndEvent) {
		if (over?.id === undefined) return

		const now = dayjs()
		const active_item = this.calendar_days[active.data.current.day_index][active.data.current.timeblock_index]
		const date = this.days[over.id as number].value
		const { start_time, end_time } = getStartEnd(date, this.move_item.start, this.move_item.length)

		active_item.start = this.move_item.start
		active_item.length = this.move_item.length
		active_item.start_time = start_time
		active_item.end_time = end_time
		active_item.past = now.valueOf() >= active_item.end_time

		if (active.data.current.day_index === over.id) {
			this.calendar_days[active.data.current.day_index][active.data.current.timeblock_index] =
				$copy(active_item)
		} else {
			this.calendar_days[active.data.current.day_index].splice(active.data.current.timeblock_index, 1)
			this.calendar_days[over.id].push($copy(active_item))
		}

		this.move_item = null

		await this.updateTimeBlock(active_item.id, { start_time, end_time })
	}

	async changeTimeBlockLength(args: { day_index: number; timeblock_index: number; step: number }) {
		const { day_index, timeblock_index, step } = args
		const item = this.calendar_days[day_index][timeblock_index]
		const target_length = item.length + step

		if (!target_length) return

		item.length = target_length
		item.end_time = dayjs(item.start_time)
			.add(item.length * 20, 'minutes')
			.valueOf()

		this.updateTimeBlock(item.id, { end_time: item.end_time })
	}

	async updateTodoSchedule(id: string) {
		const doc = await $db.todo_items.findOne(id).exec()

		if (!doc.schedule) return

		await doc.updateCRDT({ ifMatch: { $unset: { schedule: false } } })
	}

	async updateSetting(changed_values: ChangedSettingValues, values: SettingValues) {
		await updateSetting({ file_id: this.id, setting: this.setting, changed_values, values })
	}

	async removeTag(tag: string) {
		const counts = await getTagTimeBlockCounts(this.id, tag)

		if (counts > 0) {
			const res = await confirm({
				id: this.id,
				title: $t('translation:common.notice'),
				// @ts-ignore
				content: $t('translation:todo.SettingsModal.tags.remove_confirm', { counts })
			})

			if (!res) return false
		}

		await removeTag(this.id, tag)

		return true
	}

	async cleanByTime(v: CleanTime) {
		await cleanByTime(this.id, v)
	}

	watchSetting() {
		this.setting_watcher = getQuerySetting(this.id).$.subscribe(setting => {
			const doc_setting = getDocItem(setting)

			this.setting = { ...omit(doc_setting, 'setting'), setting: JSON.parse(doc_setting.setting) }
		})
	}

	watchCalendarDays() {
		this.stopWatchCalendarDays()

		const start_time = this.days.at(0).value.startOf('day')
		const end_time = this.days.at(-1).value.endOf('day')

		this.calendar_days_watcher = getTimeBlocks(
			this.id,
			{
				type: this.view,
				start_time: { $gte: start_time.valueOf() },
				end_time: { $lte: end_time.valueOf() + 1 }
			},
			this.filter_tags
		).$.subscribe(doc => {
			if (this.disable_watcher) return

			const items = getDocItemsData(doc)
			const target = this.days.map(_ => [])
			const now = dayjs()

			items.forEach(item => {
				const start_time = dayjs(item.start_time)
				const end_time = dayjs(item.end_time)
				const begin = dayjs(item.start_time).startOf('day')
				const date = start_time.format('YYYY-MM-DD')
				const index = this.days.findIndex(day => day.value.format('YYYY-MM-DD') === date)
				item['start'] = start_time.diff(begin, 'minutes') / 20
				item['length'] = end_time.diff(start_time, 'minutes') / 20

				if (this.show_time_scale) {
					item['past'] = now.valueOf() >= item.end_time
				}

				if (index !== -1) {
					if (target[index]) {
						target[index].push(item)
					} else {
						target[index] = [item]
					}
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

	on() {
		this.watchSetting()
	}

	off() {
		this.utils.off()

		this.setting_watcher?.unsubscribe?.()
		this.calendar_days_watcher?.unsubscribe?.()
	}
}
