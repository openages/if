import { debounce } from 'lodash-es'
import { makeAutoObservable, reaction, toJS } from 'mobx'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { id } from '@/utils'
import { remove, find } from '@/utils/tree'
import { deepEqual } from '@openages/craftkit'

import { addToDir, rename } from './utils'

import type { RxDocument, RxQuery } from 'rxdb'
import type { App, DirTree, Module } from '@/types'
import type { IProps } from './types'

@injectable()
export default class Index {
	module = '' as App.RealModuleType
	actions = {} as IProps['actions']
	dirtree_query = {} as RxQuery<Module.Item>
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
		this.dirtree_query = $db.module.findOne({ selector: { module: this.module } })! as RxQuery<Module.Item>

		const target = (await this.dirtree_query.exec()) as RxDocument<Module.Item>

		this.doc = target
		this.dirtree = target.dirtree

		target.$.subscribe((v) => {
			this.doc = v
			this.dirtree = v.dirtree
		})
	}

	async add(type: DirTree.Type, args: Partial<DirTree.Item>) {
		return await match({ type })
			.with({ type: 'file' }, () => this.addFile(args as DirTree.File))
			.with({ type: 'dir' }, () => this.addDir(args as DirTree.Dir))
			.exhaustive()
	}

	async delete(current_item_id: string) {
		await this.actions.remove(this.focusing_item, current_item_id, this.module)

		await this.doc.incrementalModify((doc) => {
			remove(doc.dirtree, this.focusing_item.id)

			return doc
		})
	}

	async update(v: DirTree.Items) {
		return await this.doc.incrementalModify((doc) => {
			doc.dirtree = v

			return doc
		})
	}

	async rename(args: Partial<DirTree.Item>) {
		const target_id = args.id ?? this.focusing_item.id

		await this.doc.incrementalModify((doc) => {
			rename(doc.dirtree, { ...args, id: target_id })

			return doc
		})

		const current_file = find(this.dirtree, target_id)

		await $app.Event.emit('global.tabs.updateFile', { ...current_file, ...args, id: target_id })
	}

	private async addDir(args: DirTree.Dir) {
		const dir: DirTree.Dir = { ...args, id: id(), type: 'dir', children: [] }

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

	private async addFile(args: DirTree.File) {
		const file_id = id()

		await this.actions.add(file_id, args)

		const file: DirTree.File = { ...args, id: file_id, type: 'file' }

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
}
