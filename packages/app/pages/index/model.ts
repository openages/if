import { omit } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { update } from '@/actions/todo'
import { GlobalModel } from '@/context/app'

import Services from './services'

import type { Todo } from '@/types'

@injectable()
export default class Index {
	visible_settings_modal = false

	constructor(
		public global: GlobalModel,
		public services: Services
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {
		this.services.init()

		this.on()
	}

	async onInfoChange(
		changedValues: Partial<Todo.Data>,
		values: Omit<Todo.Data, 'angles' | 'tags'> & { angles: Array<{ id: string; text: string }> } & {
			tags: Array<{ id: string; color: string; text: string }>
		}
	) {
		this.services.info = { ...this.services.info, ...values } as Todo.Data

		if (changedValues.name || changedValues.icon) {
			await $app.Event.emit('todo/dirtree/rename', {
				id: this.services.id,
				name: this.services.info.name,
				icon: this.services.info.icon
			})
		}

		await update(this.services.id, omit(this.services.info, 'id'))
	}

	on() {
		$app.Event.on('todo/ready', this.init)
	}

	off() {
		$app.Event.off('todo/ready', this.init)

		this.services.off()
	}
}
