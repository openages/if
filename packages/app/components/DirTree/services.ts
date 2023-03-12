import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { match } from 'ts-pattern'
import { injectable } from 'tsyringe'

import { getFileCounts, getPresetData } from '@/utils'

import type { App, DirTree, Doc } from '@/types'

@injectable()
export default class Index {
	module = '' as App.ModuleType
	tree = {} as Doc.Module
	listener = null as PouchDB.Core.Changes<Doc.Module> | null
	modal_open = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	private async addTarget(name: string, file_id: string) {
		const { id } = await $db.put({
			_id: nanoid(),
			name,
			file_id,
			module: this.module,
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
		const file_id = nanoid()
		const target_id = await this.addTarget(name, file_id)

		res.data.push({
			_id: file_id,
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

		this.tree = res

		this.getCounts()
	}

	async getCounts() {
		if (!this.tree.data.length) return

		this.tree.data.map(async (item) => {
			if (item.type === 'dir') return

			const { docs } = await $db.find({
				selector: { _id: item.target_id },
				fields: ['data.angles']
			})

			item.counts = getFileCounts(this.module, docs[0].data)
		})

		await $db.put(this.tree)
	}

	async init(module: App.ModuleType) {
		this.module = module

		this.query()
		this.on()
	}

	on() {
		$app.Event.on(`${this.module}/getCounts`, this.getCounts)

		this.listener = $db.changes({
			live: true,
			since: 'now',
			include_docs: true,
			doc_ids: [this.module]
		})

		this.listener.on('change', ({ doc }) => (this.tree = doc!))
	}

	off() {
		$app.Event.off(`${this.module}/getCounts`, this.getCounts)

		this.listener?.cancel()
	}
}
