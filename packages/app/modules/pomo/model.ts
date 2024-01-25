import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { File } from '@/models'
import { getDocItem } from '@/utils'

import { getPomo } from './services'

import type { Subscription } from 'rxjs'
import type { Pomo } from '@/types'

@injectable()
export default class Index {
	id = ''
	watcher = null as Subscription
	data = {} as Pomo.Item
	state = { index: 0, status: '', work_in: 0, break_in: 0 } as Pomo.State

	constructor(public file: File) {
		makeAutoObservable(this, { watcher: false }, { autoBind: true })
	}

	init(args: { id: string }) {
		const { id } = args

		this.id = id
		this.file.init(id)

		this.on()
	}

	on() {
		this.watcher = getPomo(this.id).$.subscribe(doc => {
			this.data = getDocItem(doc)
		})
	}

	off() {
		this.watcher?.unsubscribe?.()
	}
}
