import dayjs from 'dayjs'
import { pick } from 'lodash-es'
import { makeAutoObservable } from 'mobx'

import getTodoItems from '@/modules/todo/utils/getTodoItems'
import { getDays, getMonthDaysWithWeekCol, hour_counts, month_counts } from '@/utils'

import type { Todo } from '@/types'
import type { MangoQuerySelector, RxDocument } from 'rxdb'

interface TodoItem {
	id: string
	text: string
	done_time: string
}

export type Todos = Array<TodoItem> | null
type ChartItem = Record<string, Todos>
type ChartItems = Array<ChartItem> | null

export default class Index {
	id = ''
	type = 'week' as 'week' | 'month' | 'year'
	current = dayjs().format('YYYY-MM-DD') as string
	index = { x: 0, y: 0 }
	data_items = [] as Array<TodoItem>
	chart_items = null as ChartItems

	get total() {
		return 0
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
		this.type = v || 'week'

		const now = dayjs(this.current)
		const selector: MangoQuerySelector<Todo.Todo> = { file_id: this.id, type: 'todo', status: 'checked' }

		selector['done_time'] = {
			$gte: now.startOf(this.type).valueOf(),
			$lte: now.endOf(this.type).valueOf()
		}

		const items = await $db.todo_items.find({ selector }).sort({ done_time: 'asc' }).limit(99999).exec()

		const data_items = getTodoItems(items as Array<RxDocument<Todo.Todo>>, item =>
			pick(item, ['id', 'text', 'done_time'])
		) as Array<TodoItem>

		this.data_items = data_items

		if (this.type === 'week') {
			const days = getDays(this.type, now)

			const cols: ChartItems = days.map(day => {
				return hour_counts.reduce(
					(total, v) => {
						total[dayjs(day).hour(v).format('YYYY-MM-DD HH')] = null

						return total
					},
					{} as Record<string, null>
				)
			})

			data_items.forEach(item => {
				const time = dayjs(item.done_time)

				const week = time.day()

				const day_items = cols[week - 1]
				const key = time.format('YYYY-MM-DD HH')

				if (Array.isArray(day_items[key])) {
					day_items[key].push(item)
				} else {
					day_items[key] = [item]
				}
			})

			this.chart_items = cols
		} else if (this.type === 'month') {
			const cols: ChartItems = getMonthDaysWithWeekCol(now)

			data_items.forEach(item => {
				const time = dayjs(item.done_time)
				const week = time.day()

				const week_items = cols[week - 1]
				const key = time.format('YYYY-MM-DD')

				if (Array.isArray(week_items[key])) {
					week_items[key].push(item)
				} else {
					week_items[key] = [item]
				}
			})

			this.chart_items = cols
		} else if (this.type === 'year') {
			const rows: ChartItems = month_counts.map(month => {
				const date = dayjs(this.current).month(month)

				return getDays('month', date).reduce(
					(total, day) => {
						total[day.format('YYYY-MM-DD')] = null

						return total
					},
					{} as Record<string, null>
				)
			})

			this.chart_items = rows
		}
	}

	prev() {}

	next() {}
}
