import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { id } from '@/utils'

import { addFileToDir, addTargetTodo, deleteTargetTodo, remove, rename } from './utils'

import type { RxDocument } from 'rxdb'
import type { App, DirTree, Module } from '@/types'

@injectable()
export default class Index {
	module = '' as App.RealModuleType
	doc = {} as RxDocument<Module.Item>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(module: App.RealModuleType) {
		this.module = module

		await this.query()

		this.on()
	}

	async query() {
		this.doc = (await $db.module
			.findOne({ selector: { module: this.module } })
			.exec())! as RxDocument<Module.Item>
	}

	async add(focusing_item: DirTree.Item, type: DirTree.Type, name: string, with_context_menu?: boolean) {
		if (with_context_menu) {
			return await this.addFile(focusing_item, name, with_context_menu)
		} else {
			return await match({ type })
				.with({ type: 'dir' }, () => this.addDir(name))
				.with({ type: 'file' }, () => this.addFile(focusing_item, name))
				.exhaustive()
		}
	}

	async delete(focusing_item: DirTree.Item) {
		await this.doc.incrementalModify((doc) => {
			remove(doc.dirtree, focusing_item.id)

			return doc
		})

		if (focusing_item.type !== 'file') return

		return match(this.module)
			.with('todo', () => deleteTargetTodo(focusing_item.id))
			.otherwise(() => {})
	}

	async rename(focusing_item: DirTree.Item, v: string) {
		return await this.doc.incrementalModify((doc) => {
			rename(doc.dirtree, focusing_item.id, v)

			return doc
		})
	}

	private async addTarget(name: string, file_id: string) {
		return match(this.module)
			.with('todo', () => addTargetTodo(name, file_id))
			.otherwise(() => {})
	}

	private async addDir(name: string) {
		return await this.doc.incrementalUpdate({
			$push: {
				dirtree: {
					id: id(),
					type: 'dir',
					name,
					children: []
				}
			}
		})
	}

	private async addFile(focusing_item: DirTree.Item, name: string, with_context_menu?: boolean) {
		const file_id = id()

		await this.addTarget(name, file_id)

		const file: DirTree.File = { id: file_id, type: 'file', name }

		if (with_context_menu) {
			return await this.doc.incrementalModify((doc) => {
				addFileToDir(doc.dirtree, focusing_item.id, file)

				return doc
			})
		} else {
			return await this.doc.incrementalUpdate({
				$push: { dirtree: file }
			})
		}
	}

	on() {
		this.doc.$.subscribe((v) => (this.doc = v))
	}
}
