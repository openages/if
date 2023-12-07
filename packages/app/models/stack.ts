import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import Utils from '@/models/utils'
import { arrayMove } from '@dnd-kit/sortable'
import { setStorageWhenChange } from '@openages/stk'

import type { DirTree, Stack } from '@/types'
import type { DragEndEvent } from '@dnd-kit/core'

@injectable()
export default class Index {
	observer = null as ResizeObserver
	columns = [] as Stack.Columns
	focus = { column: -1, view: -1 } as Stack.Position
	container_width = 0

	constructor(public utils: Utils) {
		makeAutoObservable(this, {}, { autoBind: true, deep: true })

		this.utils.acts = [setStorageWhenChange(['columns', 'focus', 'container_width'], this)]
	}

	init() {
		this.getObserver()
	}

	updateColumns() {
		this.columns = toJS(this.columns)
	}

	find(id: string) {
		for (let column_index = 0; column_index < this.columns.length; column_index++) {
			const column = this.columns[column_index]

			for (let view_index = 0; view_index < column.views.length; view_index++) {
				const view = column.views[view_index]

				if (view.id === id) {
					return { view, column_index, view_index }
				}
			}
		}

		return {}
	}

	add(view: Stack.View) {
		const exsit_view = this.find(view.id)

		if (exsit_view?.view) {
			exsit_view.view.active = true

			this.focus = { column: exsit_view.column_index, view: exsit_view.view_index }

			return
		}

		if (this.focus.column === -1) {
			this.columns = [{ views: [view], width: this.container_width }]

			return
		}

		const target_views = this.columns[this.focus.column].views
		const last_view = target_views.at(-1)

		if (!last_view || last_view?.fixed) {
			target_views.push(view)
		} else {
			target_views.splice(target_views.length - 1, 1, view)
		}

		target_views.forEach(item => (item.active = false))

		target_views[target_views.length - 1].active = true

		this.focus.view = target_views.length - 1

		this.updateColumns()
	}

	remove(position: Stack.Position) {
		const { column, view } = position
		const target_views = this.columns[column].views

		target_views.splice(view, 1)

		if (!target_views.length) {
			this.columns.splice(column, 1)

			if (this.focus.column === column && this.focus.view === view) {
				let target_column = this.columns[this.columns.length - 1]

				if (!target_column) {
					this.focus = { column: -1, view: -1 }
				} else {
					this.focus.column = this.columns.length - 1
					this.focus.view = target_column.views.length - 1
				}
			}

			this.updateColumns()

			return
		}

		const exsit_active = target_views.some(item => item.active)

		if (!exsit_active) {
			target_views[target_views.length - 1].active = true
		}

		if (this.focus.column === column && this.focus.view === view) {
			this.focus.view = target_views.length - 1
		}

		this.updateColumns()
	}

	click(position: Stack.Position) {
		const { column, view } = position
		const target_views = this.columns[column].views

		if (target_views[view].active) return

		target_views.forEach(item => (item.active = false))

		target_views[view].active = true

		this.focus = position

		this.updateColumns()
	}

	update({ position, v }: { position: Stack.Position; v: Partial<Stack.View> }) {
		this.columns[position.column].views[position.view] = {
			...this.columns[position.column].views[position.view],
			...v
		}

		this.updateColumns()
	}

	updateFile(v: DirTree.Item) {
		const exsit_view = this.find(v.id)

		if (!exsit_view?.view) return

		this.columns[exsit_view.column_index].views[exsit_view.view_index].file = v

		this.updateColumns()
	}

	removeFile(id: string) {
		const exsit_view = this.find(id)

		if (!exsit_view?.view) return

		this.remove({ column: exsit_view.column_index, view: exsit_view.view_index })
	}

	move({ active, over }: Pick<DragEndEvent, 'active' | 'over'>) {
		if (!over?.id) return false
		if (active.id === over.id) return

		const active_column = active.data.current.column as number
		const over_column = over.data.current.column as number
		const active_view = active.data.current.view as number
		const over_view = over.data.current.view as number
		const split = over.data.current.split as boolean

		if (!split) {
			if (active_column === over_column) {
				const target_views = this.columns[active_column].views
				const active_item = target_views[active_view]

				if (!active_item.fixed) {
					active_item.fixed = true
				}

				this.columns[active_column].views = arrayMove(
					toJS(this.columns[active_column].views),
					active_view,
					over_view
				)

				this.focus.view = over_view
			} else {
				const target = toJS(this.columns[active_column].views[active_view])

				this.remove({ column: active_column, view: active_view })

				this.columns[over_column].views.push(target)

				const target_views = this.columns[over_column].views

				target_views.forEach(item => (item.active = false))

				target_views[target_views.length - 1].active = true

				this.focus = { column: over_column, view: target_views.length - 1 }
			}
		} else {
			const direction = 'left' as 'left' | 'right'
			const target_column = this.columns[active_column]
			const target_views = [toJS(target_column.views[active_view])]

			let width = 0
			let index = 0

			if (active_column === over_column) {
				if (this.columns[active_column].views.length === 1) return

				this.remove({ column: active_column, view: active_view })

				width = target_column.width / 2
				index = active_column
			} else {
				this.remove({ column: active_column, view: active_view })

				width = (target_column.width + this.columns[over_column].width) / 3
				index = active_column

				this.columns[over_column].width = width
			}

			target_column.width = width

			const target_index = direction === 'left' ? index : index + 1

			this.columns.splice(target_index, 0, {
				views: target_views,
				width
			} as Stack.Column)

			this.focus = { column: target_index, view: 0 }
		}

		this.updateColumns()
	}

	getObserver() {
		this.observer = new ResizeObserver(elements => {
			if (!elements.length) return

			const width = elements[0].contentRect.width

			if (this.container_width === width) return

			this.container_width = width
		})
	}

	observe() {
		this.observer.observe(document.getElementById('stacks_container'))
	}

	unobserve() {
		this.observer?.disconnect()
	}

	off() {
		this.observer?.disconnect()
		this.utils.off()
	}
}
