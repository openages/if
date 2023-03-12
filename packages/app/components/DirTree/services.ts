import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { getPresetData } from '@/appdata'

import type { App, DirTree, Doc } from '@/types'

@injectable()
export default class Index {
	module = '' as App.ModuleType
	items = [] as DirTree.Items
	listener = null as PouchDB.Core.Changes<Doc.Module> | null
	modal_open = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	private async addTarget(name: string) {
		const { id } = await $db.put({
			_id: nanoid(),
			name,
			data: getPresetData(this.module)
		})

		return id
	}

	private async addDir(name: string, res: Doc.Module) {
		res.data.push({
			_id: nanoid(),
			type: 'dir',
			name,
			children: []
		})

		return await $db.put(res)
	}

	private async addFile(name: string, res: Doc.Module) {
		const target_id = await this.addTarget(name)

		res.data.push({
			_id: nanoid(),
			type: 'file',
			name,
			target_id
		})

		return await $db.put(res)
	}

	async add(type: DirTree.Type, name: string) {
		const [err, res] = await to<Doc.Module>($db.get(this.module))

		if (err) return

		await match({ type })
			.with({ type: 'dir' }, () => this.addDir(name, res))
			.with({ type: 'file' }, () => this.addFile(name, res))
			.exhaustive()

		this.modal_open = false
	}

	async delete() {}

	async update() {}

	async query() {
		const [err, res] = await to<Doc.Module>($db.get(this.module))

		if (err) return

		this.items = res.data
	}

	async init(module: App.ModuleType) {
		this.module = module

		this.query()
		this.on()
	}

	on() {
		this.listener = $db.changes({
			live: true,
			since: 'now',
			include_docs: true,
			doc_ids: [this.module]
		})

		this.listener.on('change', ({ doc }) => {
			this.items = doc?.data || []
		})
	}

	off() {
		this.listener?.cancel()
	}
}
