import dayjs from 'dayjs'
import { pick } from 'lodash-es'
import { makeAutoObservable } from 'mobx'

import getTodoItems from '@/modules/todo/utils/getTodoItems'
import { getDays, getMonthDaysWithWeekCol, hour_counts, minute_pieces, month_counts } from '@/utils'

import { getRelativeMinute, getRelativeTime } from './utils'

import type { Todo } from '@/types'
import type { MangoQuerySelector, RxDocument } from 'rxdb'

type RelativeDate = 'pass' | 'now' | 'future'

interface TodoItem {
	id: string
	text: string
	done_time: string
}

export type Todos = { todos: Array<TodoItem>; relative_date: RelativeDate } | RelativeDate

type ChartItem = Record<string, Todos>
type ChartItems = Array<ChartItem>
type ChartData = {
	items: ChartItems
	percent: number
	left: number
	total_todos: number
	max: { time: string; count: number }
} | null

export default class Index {
	id = ''
	type = 'week' as 'day' | 'week' | 'month' | 'year'
	current = dayjs().format('YYYY-MM-DD HH:mm:ss') as string
	index = { x: 0, y: 0 }
	data_items = [] as Array<TodoItem>
	chart_data = null as ChartData

	get total() {
		return this.data_items.length
	}

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(args: { id?: Index['id']; type?: Index['type'] }) {
		const { id, type } = args

		if (id) this.id = id
		if (type) this.type = type

		this.query()
	}

	async query(v?: Index['type']) {
		this.type = v || 'day'

		const now = dayjs()
		const selector: MangoQuerySelector<Todo.Todo> = { file_id: this.id, type: 'todo', status: 'checked' }

		this.current = now.format('YYYY-MM-DD HH:mm:ss')

		selector['done_time'] = {
			$gte: now.startOf(this.type).valueOf(),
			$lte: now.endOf(this.type).valueOf()
		}

		const items = await $db.todo_items.find({ selector }).sort({ done_time: 'asc' }).limit(99999).exec()

		const data_items = getTodoItems(items as Array<RxDocument<Todo.Todo>>, item =>
			pick(item, ['id', 'text', 'done_time'])
		) as Array<TodoItem>

		this.data_items = data_items

		let all = 0
		let pass = 0
		let left = 0
		let total_todos = data_items.length
		let max = { time: '', count: 0 }

		if (this.type === 'day') {
			left = 23 - now.hour()

			const cols: ChartItems = hour_counts.map(hour => {
				return minute_pieces.reduce(
					(total, v) => {
						const minute = v * 10
						const time = now.hour(hour).minute(minute)
						const relative_date = getRelativeMinute('YYYY-MM-DD HH:' + minute, time, minute)

						total[time.format('YYYY-MM-DD HH:') + minute] = relative_date

						all += 1

						if (relative_date === 'pass') {
							pass += 1
						}

						return total
					},
					{} as Record<string, RelativeDate>
				)
			})

			data_items.forEach(item => {
				const time = dayjs(item.done_time)

				const hour = time.hour()
				const minute = Math.floor(time.minute() / 10) * 10

				const day_items = cols[hour]
				const key = time.format('YYYY-MM-DD HH:') + minute

				if (typeof day_items[key] === 'string') {
					day_items[key] = {
						todos: [item],
						relative_date: getRelativeMinute('YYYY-MM-DD HH:', time, minute)
					}
				} else {
					day_items[key].todos.push(item)

					if (day_items[key].todos.length > max.count) {
						const next_time = time.add(10, 'minute')
						const next_minute = Math.floor(next_time.minute() / 10) * 10

						max.count = day_items[key].todos.length
						max.time =
							$t('common.today') +
							$t('common.letter_space') +
							time.format('HH:') +
							minute +
							' - ' +
							next_time.format('HH:') +
							next_minute
					}
				}
			})

			this.chart_data = {
				items: cols,
				percent: parseFloat((pass / all).toFixed(2)) * 100,
				left,
				total_todos,
				max
			}
		} else if (this.type === 'week') {
			const days = getDays(this.type, now)

			const cols: ChartItems = days.map(day => {
				return hour_counts.reduce(
					(total, v) => {
						const time = dayjs(day).hour(v)
						const relative_date = getRelativeTime('YYYY-MM-DD HH', time)

						total[time.format('YYYY-MM-DD HH')] = relative_date

						all += 1

						if (relative_date === 'pass') {
							pass += 1
						} else {
							left += 1
						}

						return total
					},
					{} as Record<string, RelativeDate>
				)
			})

			data_items.forEach(item => {
				const time = dayjs(item.done_time)

				const week = time.day()

				const day_items = cols[week - 1]
				const key = time.format('YYYY-MM-DD HH')

				if (typeof day_items[key] === 'string') {
					day_items[key] = { todos: [item], relative_date: getRelativeTime('YYYY-MM-DD HH', time) }
				} else {
					day_items[key].todos.push(item)

					if (day_items[key].todos.length > max.count) {
						const next_time = time.add(1, 'hour')

						max.count = day_items[key].todos.length
						max.time = time.format('HH')
						' - ' + next_time.format('HH')
					}
				}
			})

			this.chart_data = {
				items: cols,
				percent: parseFloat((pass / all).toFixed(2)) * 100,
				left,
				total_todos,
				max
			}
		} else if (this.type === 'month') {
			const { days, all, pass, left } = getMonthDaysWithWeekCol(now)

			const cols: ChartItems = days

			data_items.forEach(item => {
				const time = dayjs(item.done_time)
				const week = time.day()

				const week_items = cols[week - 1]
				const key = time.format('YYYY-MM-DD')

				if (typeof week_items[key] === 'string') {
					week_items[key] = { todos: [item], relative_date: getRelativeTime('YYYY-MM-DD', time) }
				} else {
					week_items[key].todos.push(item)

					if (week_items[key].todos.length > max.count) {
						max.count = week_items[key].todos.length
						max.time = time.format('YYYY-MM-DD')
					}
				}
			})

			this.chart_data = {
				items: cols,
				percent: parseFloat((pass / all).toFixed(2)) * 100,
				left,
				total_todos,
				max
			}
		} else if (this.type === 'year') {
			const rows: ChartItems = month_counts.map(month => {
				const date = dayjs(this.current).month(month)

				return getDays('month', date).reduce(
					(total, day) => {
						const relative_date = getRelativeTime('YYYY-MM-DD', day)

						total[day.format('YYYY-MM-DD')] = relative_date

						all += 1

						if (relative_date === 'pass') {
							pass += 1
						} else {
							left += 1
						}

						return total
					},
					{} as Record<string, RelativeDate>
				)
			})

			data_items.forEach(item => {
				const time = dayjs(item.done_time)
				const month = time.month()

				const month_items = rows[month]
				const key = time.format('YYYY-MM-DD')

				if (typeof month_items[key] === 'string') {
					month_items[key] = { todos: [item], relative_date: getRelativeTime('YYYY-MM-DD', time) }
				} else {
					month_items[key].todos.push(item)

					if (month_items[key].todos.length > max.count) {
						max.count = month_items[key].todos.length
						max.time = time.format('YYYY-MM-DD')
					}
				}
			})

			this.chart_data = {
				items: rows,
				percent: parseFloat((pass / all).toFixed(2)) * 100,
				left,
				total_todos,
				max
			}
		}
	}

	prev() {}

	next() {}
}
