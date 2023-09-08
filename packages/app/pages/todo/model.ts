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
		changedValues: Partial<Todo.Data & Services['file']['data']> & {
			icon_info: { icon: string; icon_hue?: number }
		},
		values: Todo.Data & Services['file']
	) {
		if (changedValues.name || changedValues.icon_info) {
			await $app.Event.emit('todo/dirtree/rename', {
				id: this.services.id,
				...(changedValues.icon_info ?? changedValues)
			})
		} else {
			this.services.info = { ...this.services.info, ...omit(values, 'icon_info') } as Todo.Data

			await update(this.services.id, omit(this.services.info, 'id'))
		}
	}

	on() {
		$app.Event.on('todo/ready', this.init)
	}

	off() {
		$app.Event.off('todo/ready', this.init)

		this.services.info_query?.$?.unsubscribe?.()
		this.services.items_query?.$?.unsubscribe?.()

		this.services.file.off()
	}
}
