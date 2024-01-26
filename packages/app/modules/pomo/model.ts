import { makeAutoObservable, runInAction } from 'mobx'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import { getDocItem, id } from '@/utils'
import { disableWatcher } from '@/utils/decorators'

import { getPomo, update } from './services'

import type { Subscription } from 'rxjs'
import type { Pomo } from '@/types'

@injectable()
export default class Index {
	id = ''
	watcher = null as Subscription
	data = {} as Pomo.Item
	view_index = 0
	view_direction = 0
	disable_watcher = false

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
	async next() {}

	changeViewIndex(v: number) {
		runInAction(() => {
			this.view_direction = v - this.view_direction
			this.view_index = v
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
