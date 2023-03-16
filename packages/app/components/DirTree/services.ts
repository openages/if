import { remove } from 'lodash-es'
import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { id } from '@/utils'

import { addTargetTodo, deleteTargetTodo, setName } from './utils'

import type { RxDocument } from 'rxdb'
import type { App, DirTree, Module } from '@/types'

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
		return match(this.module)
			.with('todo', () => addTargetTodo(name, file_id))
			.otherwise(() => {})
	}

	private async addDir(name: string) {
		await this.doc
			.incrementalUpdate({
				$push: {
					dirtree: {
						id: id(),
						type: 'dir',
						name,
						children: []
					}
				}
			})
			.catch((e) => console.log(e))
	}

	private async addFile(name: string) {
		const file_id = id()

		await this.addTarget(name, file_id)

		await this.doc
			.incrementalUpdate({
				$push: {
					dirtree: {
						id: file_id,
						type: 'file',
						name
					}
				}
			})
			.catch((e) => console.log(e))
	}

	async rename(v: string) {
		await this.doc.incrementalModify((doc) => {
			setName(doc.dirtree, this.focusing_item.id, v)

			return doc
		})

		this.modal_open = false
		this.focusing_item = {} as DirTree.Item
	}

	async add(type: DirTree.Type, name: string) {
		await match({ type })
			.with({ type: 'dir' }, () => this.addDir(name))
			.with({ type: 'file' }, () => this.addFile(name))
			.exhaustive()

		this.modal_open = false
	}

	async delete() {
		await this.doc.incrementalModify((doc) => {
			remove(doc.dirtree, (item) => item.id === this.focusing_item.id)

			return doc
		})

		if (this.focusing_item.type !== 'file') return

		return match(this.module)
			.with('todo', () => deleteTargetTodo(this.focusing_item.id))
			.otherwise(() => {})
	}

	async update() {}

	async query() {
		this.doc = (await $db.module
			.findOne({ selector: { module: this.module } })
			.exec())! as RxDocument<Module.Item>
	}

	async init(module: App.RealModuleType) {
		this.module = module

		await this.query()

		this.on()
	}

	on() {
		this.doc.$.subscribe((v) => (this.doc = v))
	}

	off() {}
}
