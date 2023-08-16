import { debounce } from 'lodash-es'
import { makeAutoObservable, reaction, toJS } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { id } from '@/utils'
import { remove } from '@/utils/tree'
import { deepEqual } from '@openages/craftkit'

import { addToDir, rename } from './utils'

import type { RxDocument } from 'rxdb'
import type { App, DirTree, Module } from '@/types'
import type { IProps } from './types'

@injectable()
export default class Index {
	module = '' as App.RealModuleType
	actions = {} as IProps['actions']
	doc = {} as RxDocument<Module.Item>
	dirtree = [] as DirTree.Items
	focusing_item = {} as DirTree.Item

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async init(module: App.RealModuleType) {
		this.module = module

		await this.query()
		await this.actions?.getRefs?.(this.doc.dirtree)

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

	async delete(current_item: string) {
		await this.doc.incrementalModify((doc) => {
			remove(doc.dirtree, this.focusing_item.id)

			return doc
		})

		await this.actions.remove(this.focusing_item, current_item, this.module)
	}

	async update(v: DirTree.Items) {
		return await this.doc.incrementalModify((doc) => {
			doc.dirtree = v

			return doc
		})
	}

	async rename({ id, name, icon }: { id?: string; name: string; icon: string }) {
		if (this.focusing_item.type === 'file') {
			await this.actions.update(id ?? this.focusing_item.id, { name, icon })
		}

		await this.doc.incrementalModify((doc) => {
			rename(doc.dirtree, id ?? this.focusing_item.id, name, icon)

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

		await this.actions.add(name, icon, file_id)

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
