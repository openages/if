import { $isLineBreakNode } from 'lexical'

import CodeNode from '../CodeNode'

import type { LexicalEditor } from 'lexical'

export default (node: CodeNode, editor: LexicalEditor) => {
	const code_element = editor.getElementByKey(node.getKey())

	if (!code_element) return

	const children = node.getChildren()
	const children_length = children.length.toString()

	if (children_length === code_element.getAttribute('data-children')) return

	code_element.setAttribute('data-children', children_length)

	let gutter: string = '1'
	let count: number = 1

	for (let i: number = 0; i < children.length; i++) {
		if ($isLineBreakNode(children[i])) {
			gutter += '\n' + ++count
		}
	}

	code_element.setAttribute('data-gutter', gutter)
}
