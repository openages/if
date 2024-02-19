import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import Utils from '@/models/utils'
import { useInstanceWatch } from '@openages/stk/mobx'

import { getCalendarDays, getDayDetails, getMonthDays, getWeekdays } from './utils'

import type { View, Scale } from './types/model'
import type { Schedule } from '@/types'
import type { Watch } from '@openages/stk/mobx'
import type { DayDetail } from './utils'

@injectable()
export default class Index {
	id = ''
	view = 'calendar' as View
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
		makeAutoObservable(this, {}, { autoBind: true })

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
	}

	step(type: 'prev' | 'next') {
		this.current = this.current[type === 'prev' ? 'subtract' : 'add'](1, this.scale)
	}

	addTimeBlock(index: number, start: number) {}

	on() {}

	off() {}
}
