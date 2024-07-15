import type { Note } from '@/types'
import type { SerializedEditorState } from 'lexical'

export default (nodes: Array<Note.Item>, gather: (key: Note.Item['id']) => void) => {
	let head_id: string | undefined

	const node_map = nodes.reduce((total, item) => {
		total.set(item.id, item)

		gather(item.id)

		if (!item.prev) head_id = item.id

		return total
	}, new Map<string, Note.Item>())

	if (!head_id) return null

	const state = {
		root: {
			children: [],
			direction: null,
			format: '',
			indent: 0,
			type: 'root',
			key: 'root',
			version: 1
		}
	} as SerializedEditorState

	let current_node_id = head_id

	while (current_node_id) {
		const node = node_map.get(current_node_id) as Note.Item

		state.root.children.push(JSON.parse(node.content))

		current_node_id = node.next
	}

	return state
}
