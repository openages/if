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
	pomo = {} as Pomo.Item

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
			this.pomo = getDocItem(doc)
		})
	}

	off() {
		this.watcher?.unsubscribe?.()
	}
}
