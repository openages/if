import { makeAutoObservable, runInAction } from 'mobx'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import { getDocItem, id } from '@/utils'
import { disableWatcher } from '@/utils/decorators'
import { arrayMove } from '@dnd-kit/sortable'

import { getPomo, update } from './services'

import type { Subscription } from 'rxjs'
import type { Pomo } from '@/types'

@injectable()
export default class Index {
	id = ''
	data = {} as Pomo.Item

	watcher = null as Subscription
	disable_watcher = false

	view_index = 0
	view_direction = 0

	visible_edit_modal = false

	constructor(public file: File) {
		makeAutoObservable(this, { watcher: false, disable_watcher: false }, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id
		this.file.init(id)

		this.on()
	}

	@disableWatcher
	async add(v: Pomo.Session) {
		this.data.sessions.push({ ...v, id: id() })

		await update(this.id, { sessions: $copy(this.data.sessions) })
	}

	@disableWatcher
	async update(index: number, v: Pomo.Session) {
		this.data.sessions[index] = { ...this.data.sessions[index], ...v }

		await update(this.id, { sessions: $copy(this.data.sessions) })
	}

	@disableWatcher
	async remove(index: number) {
		if (this.view_index === index) this.view_index = 0

		this.data.sessions.splice(index, 1)

		await update(this.id, { sessions: $copy(this.data.sessions) })
	}

	@disableWatcher
	async move(active_index: number, over_index: number) {
		this.data.sessions = arrayMove($copy(this.data.sessions), active_index, over_index)

		if (this.data.status) {
			this.data.status = ''
			this.data.work_in = 0
			this.data.break_in = 0
			this.data.index = 0
		}

		await update(this.id, $copy(this.data))
	}

	@disableWatcher
	async next() {}

	changeViewIndex(v: number | 'left' | 'right') {
		let view_direction = -1
		let view_index = -1

		if (typeof v === 'number') {
			view_direction = v - this.view_index > 0 ? 1 : -1
			view_index = v
		} else {
			view_direction = v === 'left' ? 1 : -1
			view_index = this.view_index + view_direction
		}

		if (view_index < 0 || view_index > this.data.sessions.length - 1) return

		runInAction(() => {
			this.view_direction = view_direction
			this.view_index = view_index
		})
	}

	on() {
		this.watcher = getPomo(this.id).$.subscribe(doc => {
			if (this.disable_watcher) return

			this.data = getDocItem(doc)
		})
	}

	off() {
		this.watcher?.unsubscribe?.()
	}
}
