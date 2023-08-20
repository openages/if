import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { modules } from '@/appdata'

import type { App } from '@/types'

@injectable()
export default class Index {
	apps = modules as App.Modules
	actives = [] as Array<string>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

      async init() {
            await this.query()
      }

	async query() {
		console.log(JSON.stringify($db.collections.setting))
	}
}
