import { debounce } from 'lodash-es'
import { makeAutoObservable, reaction, toJS } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { id } from '@/utils'
import { remove } from '@/utils/tree'
import { deepEqual } from '@openages/craftkit'

import { addTargetTodo, addToDir, deleteTargetTodo, getTodoRefs, rename, updateTarget } from './utils'

import type { RxDocument } from 'rxdb'
import type { App, DirTree, Module } from '@/types'

@injectable()
export default class Index {
	module = '' as App.RealModuleType
	doc = {} as RxDocument<Module.Item>
	dirtree = [] as DirTree.Items
	focusing_item = {} as DirTree.Item

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(module: App.RealModuleType) {
		this.module = module

		await this.query()
		await this.getModuleRefs()

		this.on()
		this.reactions()

		$app.Event.emit(`${this.module}/ready`)
	}

	reactions() {
		reaction(
			() => this.dirtree,
			debounce((v) => {
				if (deepEqual(toJS(v), toJS(this.doc.dirtree))) return

				this.update(v)
			}, 300)
		)
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

		this.dirtree = this.doc.dirtree
	}

	async add(type: DirTree.Type, name: string, icon: string) {
		return await match({ type })
			.with({ type: 'file' }, () => this.addFile(name, icon))
			.with({ type: 'dir' }, () => this.addDir(name, icon))
			.exhaustive()
	}

	async delete() {
		await this.doc.incrementalModify((doc) => {
			remove(doc.dirtree, this.focusing_item.id)

			return doc
		})

		return match(this.module)
			.with('todo', () => deleteTargetTodo(this.focusing_item))
			.otherwise(() => {})
	}

	async update(v: DirTree.Items) {
		return await this.doc.incrementalModify((doc) => {
			doc.dirtree = v

			return doc
		})
	}

	async rename(name: string, icon: string) {
		if (this.focusing_item.type === 'file') {
			await match(this.module)
				.with('todo', () => updateTarget(name, icon, this.focusing_item.id))
				.otherwise(() => {})
		}

		await this.doc.incrementalModify((doc) => {
			rename(doc.dirtree, this.focusing_item.id, name, icon)

			return doc
		})
	}

	private async addDir(name: string, icon: string) {
		const dir: DirTree.Dir = { id: id(), type: 'dir', name, icon, children: [] }

		if (this.focusing_item?.id) {
			return await this.doc.incrementalModify((doc) => {
				addToDir(doc.dirtree, this.focusing_item.id, dir)

				return doc
			})
		}

		return await this.doc.incrementalUpdate({
			$push: {
				dirtree: dir
			}
		})
	}

	private async addFile(name: string, icon: string) {
		const file_id = id()

		await match(this.module)
			.with('todo', () => addTargetTodo(name, icon, file_id))
			.otherwise(() => {})

		const file: DirTree.File = { id: file_id, type: 'file', name, icon }

		if (this.focusing_item?.id) {
			return await this.doc.incrementalModify((doc) => {
				addToDir(doc.dirtree, this.focusing_item.id, file)

				return doc
			})
		}

		return await this.doc.incrementalUpdate({
			$push: { dirtree: file }
		})
	}

	on() {
		this.doc.$.subscribe((v) => {
			this.doc = v
			this.dirtree = v.dirtree
		})
	}
}
