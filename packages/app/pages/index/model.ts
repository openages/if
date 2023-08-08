import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Utils } from '@/models'

import Services from './services'

@injectable()
export default class Index {
	constructor(public utils: Utils, public services: Services) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init() {
		this.services.init()
	}

	on() {
		$app.Event.on('todo/ready', this.init)
	}

	off() {
		$app.Event.off('todo/ready', this.init)

		this.services.off()
	}
}
