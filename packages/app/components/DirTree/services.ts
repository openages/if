import { makeAutoObservable } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { id } from '@/utils'

import { addTargetTodo, addToDir, deleteTargetTodo, getTodoRefs, moveTo, remove, rename } from './utils'

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
		await this.getModuleRefs()

		this.on()
	}

	async getModuleRefs() {
		return match(this.module)
			.with('todo', () => getTodoRefs(this.doc.dirtree))
			.otherwise(() => {})
	}

	async query() {
		this.doc = (await $db.module
			.findOne({ selector: { module: this.module } })
			.exec())! as RxDocument<Module.Item>
	}

	async add(focusing_item: DirTree.Item, type: DirTree.Type, name: string, icon: string) {
		return await match({ type })
			.with({ type: 'file' }, () => this.addFile(name, icon, focusing_item))
			.with({ type: 'dir' }, () => this.addDir(name, icon, focusing_item))
			.exhaustive()
	}

	async delete(focusing_item: DirTree.Item) {
		await this.doc.incrementalModify((doc) => {
			remove(doc.dirtree, focusing_item.id)

			return doc
		})

		return match(this.module)
			.with('todo', () => deleteTargetTodo(focusing_item))
			.otherwise(() => {})
	}

	async rename(focusing_item: DirTree.Item, v: string, icon: string) {
		return await this.doc.incrementalModify((doc) => {
			rename(doc.dirtree, focusing_item.id, v, icon)

			return doc
		})
	}

	async moveTo(current: DirTree.Item, target_id: string) {
		return await this.doc.incrementalModify((doc) => {
			moveTo(current, target_id, doc.dirtree)

			return doc
		})
	}

	private async addTarget(name: string, file_id: string) {
		return match(this.module)
			.with('todo', () => addTargetTodo(name, file_id))
			.otherwise(() => {})
	}

	private async addDir(name: string, icon: string, focusing_item?: DirTree.Item) {
		const dir: DirTree.Dir = { id: id(), type: 'dir', name, icon, children: [] }

		if (focusing_item?.id) {
			return await this.doc.incrementalModify((doc) => {
				addToDir(doc.dirtree, focusing_item.id, dir)

				return doc
			})
		}

		return await this.doc.incrementalUpdate({
			$push: {
				dirtree: dir
			}
		})
	}

	private async addFile(name: string, icon: string, focusing_item?: DirTree.Item) {
		const file_id = id()

		await this.addTarget(name, file_id)

		const file: DirTree.File = { id: file_id, type: 'file', name, icon }

		if (focusing_item?.id) {
			return await this.doc.incrementalModify((doc) => {
				addToDir(doc.dirtree, focusing_item.id, file)

				return doc
			})
		}

		return await this.doc.incrementalUpdate({
			$push: { dirtree: file }
		})
	}

	on() {
		this.doc.$.subscribe((v) => (this.doc = v))
	}
}
