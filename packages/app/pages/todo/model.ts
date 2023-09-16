import { omit, cloneDeep, uniq } from 'lodash-es'
import { makeAutoObservable, reaction } from 'mobx'
import { injectable } from 'tsyringe'

import { update, archive } from '@/actions/todo'
import { GlobalModel } from '@/context/app'

import Services from './services'

import type { ArgsOnInfoChange_changedValues, ArgsOnInfoChange_values, ArgsUpdateStatus } from './types'

import type { Todo } from '@/types'

@injectable()
export default class Index {
	visible_settings_modal = false
	visible_archive_modal = false
	timer: NodeJS.Timeout = null

	constructor(
		public global: GlobalModel,
		public services: Services
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(id: string) {
		this.services.init(id)

		this.reactions()
		this.on()
	}

	reactions() {
		reaction(
			() => this.visible_archive_modal,
			(v) => {
				if (v) {
					this.services.queryArchives()
					this.services.queryArchivesCounts()
				} else {
					this.services.loadmore.page = 0
					this.services.loadmore.end = false
				}
			}
		)
	}

	async onInfoChange(changedValues: ArgsOnInfoChange_changedValues, values: ArgsOnInfoChange_values) {
		if (changedValues.name || changedValues.icon_info) {
			await $app.Event.emit('todo/dirtree/updateItem', {
				id: this.services.id,
				...(changedValues.icon_info ?? changedValues)
			})
		} else {
			this.services.info = { ...this.services.info, ...omit(values, 'icon_info') } as Todo.Data

			await update(this.services.id, omit(this.services.info, 'id'))
		}
	}

	async check(v: ArgsUpdateStatus) {
		const exsit_index = this.services.info?.relations?.findIndex((item) => item.items.includes(v.id))

		await this.services.updateStatus(v)

		if (this.services.info?.relations?.length && exsit_index !== -1) {
			const relation_ids = cloneDeep(this.services.info.relations[exsit_index]).items
			const target_index = relation_ids.findIndex((item) => item === v.id)

			relation_ids.splice(target_index, 1)

			await Promise.all(
				relation_ids.map((item) => {
					return this.services.updateStatus({
						id: item,
						status: v.status === 'checked' ? 'closed' : 'unchecked'
					})
				})
			)

			const relations = cloneDeep(this.services.info.relations)

			relations[exsit_index].checked = v.status === 'checked'

			await update(this.services.id, { relations })
		}

		await archive(this.services.id)
	}

	async updateRelations(active_id: string, over_id: string) {
		if (active_id === over_id) return

		const active_item = this.services.items.find((item) => item.id === active_id) as Todo.Todo
		const over_item = this.services.items.find((item) => item.id === over_id) as Todo.Todo

		if (active_item.status !== 'unchecked' || over_item.status !== 'unchecked') return

		if (!this.services.info.relations) {
			await update(this.services.id, { relations: [{ items: [active_id, over_id], checked: false }] })
		} else {
			const relations = cloneDeep(this.services.info.relations)
			const exsit_active_index = relations.findIndex((item) => item.items.includes(active_id))
			const exsit_over_index = relations.findIndex((item) => item.items.includes(over_id))

			if (exsit_active_index === -1 && exsit_over_index === -1) {
				return await update(this.services.id, {
					relations: [...relations, { items: [active_id, over_id], checked: false }]
				})
			}

			if (exsit_active_index === exsit_over_index) {
				if (relations[exsit_active_index].items.length === 2) {
					relations.splice(exsit_active_index, 1)

					return await update(this.services.id, { relations })
				} else {
					const over_index = relations[exsit_active_index].items.findIndex(
						(item) => item === over_id
					)

					relations[exsit_active_index].items.splice(over_index, 1)

					return await update(this.services.id, { relations })
				}
			}

			if (exsit_active_index !== -1 && exsit_over_index === -1) {
				relations[exsit_active_index].items.push(over_id)

				return await update(this.services.id, { relations })
			}

			if (exsit_over_index !== -1 && exsit_active_index === -1) {
				relations[exsit_over_index].items.push(active_id)

				return await update(this.services.id, { relations })
			}

			if (exsit_active_index !== -1 && exsit_over_index !== -1) {
				const target = uniq(relations[exsit_over_index].items.concat(relations[exsit_over_index].items))

				relations[exsit_over_index].items = target

				relations.splice(exsit_over_index, 1)

				return await update(this.services.id, { relations })
			}
		}
	}

	on() {
		this.timer = setInterval(() => archive(this.services.id), 9000)
	}

	off() {
		this.services.info_query?.$?.unsubscribe?.()
		this.services.items_query?.$?.unsubscribe?.()

		this.services.file.off()

		clearInterval(this.timer)
	}
}
