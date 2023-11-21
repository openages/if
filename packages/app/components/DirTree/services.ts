import { id } from '@/utils'

import type { App, DirTree } from '@/types'
import type { ArgsCreate, ArgsUpdate, ArgsRemove } from './types/services'

export const getQuery = (module: App.ModuleType) => {
	return $db.dirtree_items.find({ selector: { module: module } })
}

export const query = async (module: App.ModuleType) => {
	return getQuery(module).exec()
}

export const create = async (args: ArgsCreate) => {
	const { module, focusing_item, actions, item } = args
	const target = { ...item, id: id(), module } as DirTree.Item

	if (item.type === 'file') {
		await actions.add(target.id, item)
	}

	if (focusing_item?.id && focusing_item?.type === 'dir') {
		target['pid'] = focusing_item.id
	}

	return $db.dirtree_items.insert(target)
}

export const update = async (args: ArgsUpdate) => {
	const { focusing_item, item } = args
	const target_id = item.id ?? focusing_item.id

	const doc = await $db.dirtree_items.findOne(target_id).exec()

	await doc.updateCRDT({ ifMatch: { $set: item } })

	if (doc.type === 'dir') return

	await $app.Event.emit('global.tabs.updateFile', {
		...item,
		id: target_id
	})
}

export const remove = async (args: ArgsRemove) => {
	const { module, focusing_item, actions, current_item_id } = args

	await actions.remove(focusing_item, current_item_id, module)

	return $db.dirtree_items.findOne(current_item_id).remove()
}
