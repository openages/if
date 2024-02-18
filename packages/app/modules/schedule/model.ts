import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { File } from '@/models'

import { getWeekdays } from './utils'

import type { View, Scale } from './types/model'

@injectable()
export default class Index {
	id = ''
	view = 'calendar' as View
	scale = 'week' as Scale
	current = dayjs()

	visible_task_panel = false

	get weekdays() {
		return getWeekdays(this.current)
	}

	constructor(public file: File) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id
		this.file.init(id)
	}

	step(type: 'prev' | 'next') {
		this.current = this.current[type === 'prev' ? 'subtract' : 'add'](1, this.scale)
	}

	on() {}

	off() {}
}
