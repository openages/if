import { $createRootNode, createEditor } from 'lexical'

import { note_nodes } from '@/Editor/nodes'
import transformers from '@/Editor/transformers'
import { $convertFromMarkdownString } from '@/Editor/utils'

export default (text: string) => {
	const editor = createEditor({ nodes: note_nodes })
	const root = $createRootNode()

	editor._headless = true

	$convertFromMarkdownString(text, transformers, root, false)

	return root.getChildren()
}
