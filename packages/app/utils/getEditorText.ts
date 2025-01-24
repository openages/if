import { $getRoot, createEditor, parseEditorState } from 'lexical'

import { text_nodes } from '@/Editor/nodes'

export default (text: string) => {
	const editor = createEditor({ nodes: text_nodes })

	editor._headless = true
	editor.setEditorState(parseEditorState(JSON.parse(text), editor))

	return editor.getEditorState().read(() => $getRoot().getTextContent())
}
