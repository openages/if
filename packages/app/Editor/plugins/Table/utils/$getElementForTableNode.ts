import { getTable } from './index'

import type TableNode from '../TableNode'

import type { LexicalEditor } from 'lexical'

export default (editor: LexicalEditor, node: TableNode) => {
	const el = editor.getElementByKey(node.getKey())

	return getTable(el)
}
