import { id } from '@/utils'
import { remove, find } from '@/utils/tree'

import { addToDir, rename } from './utils'

import type { App, Module, DirTree } from '@/types'
import type { ArgsCreate, ArgsUpdateDirtree, ArgsUpdateItem, ArgsRemove } from './types/services'
import type { RxQuery, RxDocument } from 'rxdb'

export const getQuery = (module: App.ModuleType) => {
	return $db.module.findOne({ selector: { module: module } }) as RxQuery<Module.Item>
}

export const create = async (args: ArgsCreate) => {
	const { module, focusing_item, actions, item } = args
	const { type, data } = item

	const doc = await query(module)

	if (type === 'dir') {
		const dir = { ...data, id: id(), type: 'dir', children: [] } as DirTree.Item

		if (focusing_item?.id) {
			return await doc.incrementalModify((doc) => {
				addToDir(doc.dirtree, focusing_item.id, dir)

				return doc
			})
		}

		await doc.incrementalUpdate({ $push: { dirtree: dir } })
	} else {
		const file_id = id()
		const file = { ...data, id: file_id, type: 'file' } as DirTree.Item

		await actions.add(file_id, data)

		if (focusing_item?.id) {
			return await doc.incrementalModify((doc) => {
				addToDir(doc.dirtree, focusing_item.id, file)

				return doc
			})
		}

		await doc.incrementalUpdate({
			$push: { dirtree: file }
		})
	}
}

export const query = async (module: App.ModuleType) => {
	return getQuery(module).exec() as Promise<RxDocument<Module.Item>>
}

export const updateDirtree = async (args: ArgsUpdateDirtree) => {
	const { module, data } = args

	const doc = await query(module)

	await doc.incrementalModify((doc) => {
		doc.dirtree = data

		return doc
	})
}

export const updateItem = async (args: ArgsUpdateItem) => {
	const { module, focusing_item, item } = args
	const target_id = item.id ?? focusing_item.id

	const doc = await query(module)

	await doc.incrementalModify((doc) => {
		rename(doc.dirtree, { ...item, id: target_id })

		return doc
	})

	const target = find(doc.dirtree, target_id)

	if (target.type === 'dir') return

	await $app.Event.emit('global.tabs.updateFile', {
		...target,
		...item,
		id: target_id
	})
}

export const removeItem = async (args: ArgsRemove) => {
	const { module, focusing_item, actions, current_item_id } = args

	const doc = await query(module)

	await actions.remove(focusing_item, current_item_id, module)

	await doc.incrementalModify((doc) => {
		remove(doc.dirtree, focusing_item.id)

		return doc
	})
}
