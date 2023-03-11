import to from 'await-to-js'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { injectable } from 'tsyringe'

import { getPresetData } from '@/appdata'
import { omitDirTree } from '@/utils'

import type { Doc, DirTree } from '@/types'
import type { App } from '@/types'

@injectable()
export default class Index {
	module = '' as App.ModuleType
	items = [] as Doc.Content['data']
	current_item = ''
	modal_open = false
	modal_type = 'file' as DirTree.Type
	fold_all = false
	listener = null as PouchDB.Core.Changes<Doc.Content> | null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async find() {
            await $db.createIndex({ index: { fields: [ '_id', 'data.$.name' ] } })
            
		const [err, res] = await to($db.query((doc, emit) => omitDirTree(this.module, doc, emit), {}))

		if (err) return

		console.log(res.rows)

		// this.items = res.data || []
	}

	async add(name: string) {
		const module = await $db.get(this.module)

		if (this.modal_type === 'dir') {
			module.data.push({
				_id: nanoid(),
				type: 'dir',
				name,
				children: []
			})
		} else {
			module.data.push({
				_id: nanoid(),
				type: 'file',
				name,
				desc: '',
				data: getPresetData(this.module)
			})
		}

		await $db.put(module)
	}

	on() {
		this.listener = $db.changes({
			live: true,
			since: 'now',
			include_docs: false,
			doc_ids: [this.module],
			query_params: ['_id']
		})

		this.listener.on('change', () => {
			this.find()
		})
	}

	off() {
		this.listener?.cancel()
	}
}
