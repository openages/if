import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import Utils from '@/models/utils'
import { getDocItemsData } from '@/utils'
import { useInstanceWatch } from '@openages/stk/mobx'

import { addTimeBlock, getTimeBlocks, updateTimeBlock } from './services'
import { getCalendarDays, getDayDetails, getMonthDays, getWeekdays } from './utils'

import type { Scale } from './types/model'
import type { Schedule } from '@/types'
import type { Watch } from '@openages/stk/mobx'
import type { DayDetail } from './utils'
import type { Subscription } from 'rxjs'

@injectable()
export default class Index {
	id = ''

	watcher = null as Subscription
	disable_watcher = false

	view = 'calendar' as Schedule.Item['type']
	scale = 'week' as Scale
	current = dayjs()
	days = [] as Array<DayDetail>
	calendar_days = [] as Schedule.CalendarDays
	timeline_days = []

	visible_task_panel = false

	watch = {
		'scale|current': () => {
			this.getDays()
		}
	} as Watch<Index & { 'scale|current': any }>

	constructor(
		public utils: Utils,
		public file: File
	) {
		makeAutoObservable(this, { watcher: false, disable_watcher: false }, { autoBind: true })

		this.utils.acts = [...useInstanceWatch(this)]
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id
		this.file.init(id)

		this.getDays()
	}

	getDays() {
		this.days = match(this.scale)
			.with('day', () => [getDayDetails(this.current)])
			.with('week', () => getWeekdays(this.current))
			.with('month', () => getMonthDays(this.current.month() + 1))
			.exhaustive()

		this.stopWatchCalendarDays()
		this.watchCalendarDays()
	}

	step(type: 'prev' | 'next') {
		this.current = this.current[type === 'prev' ? 'subtract' : 'add'](1, this.scale)
	}

	async addTimeBlock(type: Schedule.Item['type'], index: number, start: number, length: number) {
		const date = this.days[index].value
		const date_start = date.startOf('day')
		const start_time = date_start.add(start * 20, 'minutes')
		const end_time = start_time.add(length * 20, 'minutes')

		addTimeBlock(this.id, type, start_time.valueOf(), end_time.valueOf())
	}

	async updateTimeBlock(id: string, v: Partial<Schedule.Item>) {
		updateTimeBlock(id, v)
	}

	watchCalendarDays() {
		const start_time = this.days.at(0).value.startOf('day')
		const end_time = this.days.at(-1).value.endOf('day')

		this.watcher = getTimeBlocks(this.id, {
			type: this.view,
			start_time: { $gte: start_time.valueOf() },
			end_time: { $lte: end_time.valueOf() }
		}).$.subscribe(doc => {
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
		if (!this.watcher) return

		this.watcher.unsubscribe()

		this.watcher = null
	}

	on() {}

	off() {
		this.utils.off()

		this.watcher?.unsubscribe?.()
	}
}
