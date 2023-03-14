import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { getFileCounts, getPresetData } from '@/utils'

import type { RxDocument } from 'rxdb'
import type { App, DirTree, Module, Todo } from '@/types'

@injectable()
export default class Index {
	module = '' as App.RealModuleType
	modal_open = false
	doc = {} as RxDocument<Module.Item>
	focusing_item = {} as DirTree.Item

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	private async addTarget(name: string, file_id: string) {
		const res = (await $db.collections.todo.insert({
			id: nanoid(),
			file_id,
			name,
			angles: getPresetData(this.module) as any,
			archive: []
		})) as RxDocument<Todo.Data>

		return res.toJSON().id
	}

	private async addDir(name: string) {
		await this.doc
			.update({
				$push: {
					dirtree: {
						id: nanoid(),
						type: 'dir',
						name,
						children: []
					}
				}
			})
			.catch((e) => console.log(e))
	}

	private async addFile(name: string) {
		const file_id = nanoid()
		const target_id = await this.addTarget(name, file_id)

		await this.doc
			.update({
				$push: {
					dirtree: {
						id: file_id,
						type: 'file',
						name,
						target_id
					}
				}
			})
			.catch((e) => console.log(e))
	}

	async add(type: DirTree.Type, name: string) {
		await match({ type })
			.with({ type: 'dir' }, () => this.addDir(name))
			.with({ type: 'file' }, () => this.addFile(name))
			.exhaustive()

		this.modal_open = false
	}

	async delete() {}

	async update() {}

	async query() {
		this.doc = (await $db.module
			.findOne({ selector: { module: this.module } })
			.exec())! as RxDocument<Module.Item>

		// this.getCounts()
	}

	async getCounts() {
		// if (!this.tree.data.length) return
		// this.tree.data.map(async (item) => {
		// 	if (item.type === 'dir') return
		// 	const { docs } = await $db.find({
		// 		selector: { id: item.target_id },
		// 		fields: ['data.angles']
		// 	})
		// 	item.counts = getFileCounts(this.module, docs[0].data)
		// })
		// await $db.put(this.tree)
	}

	async init(module: App.RealModuleType) {
		this.module = module

		await this.query()

		this.on()
	}

	on() {
		this.doc.$.subscribe((v) => (this.doc = v))

		$app.Event.on(`${this.module}/getCounts`, this.getCounts)
	}

	off() {
		$app.Event.off(`${this.module}/getCounts`, this.getCounts)
	}
}
