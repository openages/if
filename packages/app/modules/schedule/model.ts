import dayjs from 'dayjs'
import { omit } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import Utils from '@/models/utils'
import { getQuerySetting, updateSetting } from '@/services'
import { getDocItem, getDocItemsData } from '@/utils'
import { confirm } from '@/utils/antd'
import { useInstanceWatch } from '@openages/stk/mobx'

import {
	addTimeBlock,
	getTagTimeBlockCounts,
	getTimeBlocks,
	removeTag,
	removeTimeBlock,
	updateTimeBlock
} from './services'
import { getCalendarDays, getDayDetails, getMonthDays, getWeekdays } from './utils'

import type { Scale, SettingValues, ChangedSettingValues } from './types/model'
import type { Schedule } from '@/types'
import type { Watch } from '@openages/stk/mobx'
import type { DayDetail } from './utils'
import type { Subscription } from 'rxjs'
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from '@dnd-kit/core'

@injectable()
export default class Index {
	id = ''
	view = 'calendar' as Schedule.Item['type']
	scale = 'week' as Scale
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

	active_item = null as Schedule.CalendarItem
	move_item = null as Schedule.CalendarItem

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
			{ disable_watcher: false, setting_watcher: false, calendar_days_watcher: false },
			{ autoBind: true }
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
			.with('month', () => getMonthDays(this.current.month() + 1))
			.exhaustive()

		this.watchCalendarDays()
	}

	step(type: 'prev' | 'next') {
		this.current = this.current[type === 'prev' ? 'subtract' : 'add'](1, this.scale)
	}

	onDragStart({ active }: DragStartEvent) {
		this.active_item = active.data.current.item
	}

	onDragMove({ active, over, delta }: DragMoveEvent) {
		const day_index = over.id
		console.log(delta.y)
	}

	onDragEnd({ active, over }: DragEndEvent) {
		if (!over?.id) return
		if (active.id === over.id) return

		this.active_item = null
		this.move_item = null
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
		const date_start = date.startOf('day')
		const start_time = date_start.add(start * 20, 'minutes')
		const end_time = start_time.add(length * 20, 'minutes')
		const target_info = info ? omit(info, ['start', 'length']) : {}

		await addTimeBlock(this.id, {
			type,
			...target_info,
			start_time: start_time.valueOf(),
			end_time: end_time.valueOf()
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

			items.forEach(item => {
				const start_time = dayjs(item.start_time)
				const end_time = dayjs(item.end_time)
				const begin = dayjs(item.start_time).startOf('day')
				const date = start_time.format('YYYY-MM-DD')
				const index = this.days.findIndex(day => day.value.format('YYYY-MM-DD') === date)

				item['start'] = start_time.diff(begin, 'minutes') / 20
				item['length'] = end_time.diff(start_time, 'minutes') / 20

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
