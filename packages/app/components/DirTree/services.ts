import { id } from '@/utils'

import type { App, DirTree } from '@/types'
import type { ArgsCreate, ArgsUpdate, ArgsRemove, ArgsHandleMove } from './types/services'

export const getQuery = (module: App.ModuleType) => {
	return $db.dirtree_items.find({ selector: { module: module } })
}

export const query = async (module: App.ModuleType) => {
	return getQuery(module).exec()
}

const getMaxSort = async () => {
	const [max_sort_item] = await $db.collections.dirtree_items.find().sort({ sort: 'desc' }).limit(1).exec()

	if (max_sort_item) return max_sort_item.sort

	return 0
}

export const create = async (args: ArgsCreate) => {
	const { module, focusing_item, actions, item } = args

	const sort = await getMaxSort()

	const target = { ...item, id: id(), module, sort: sort + 1 } as DirTree.Item

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

export const handleMove = async (args: ArgsHandleMove) => {
	const { active_children, over_children } = args

	if (active_children.length) {
		await Promise.all(
			active_children.map(async (item, index) => {
				const doc = await $db.dirtree_items.findOne(item.id).exec()

				return doc.updateCRDT({ ifMatch: { $set: { pid: item.pid, sort: index } } })
			})
		)
	}

	if (over_children.length) {
		await Promise.all(
			over_children.map(async (item, index) => {
				const doc = await $db.dirtree_items.findOne(item.id).exec()

				return doc.updateCRDT({ ifMatch: { $set: { pid: item.pid, sort: index } } })
			})
		)
	}
}
