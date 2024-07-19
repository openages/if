import { $getRoot, createEditor, parseEditorState } from 'lexical'

import { text_nodes } from '@/Editor/nodes'

export default (state: string) => {
	const editor = createEditor({ nodes: text_nodes })

	editor.setEditorState(parseEditorState(JSON.parse(state), editor))

	editor._headless = true

	const text = editor.getEditorState().read(() => $getRoot().getTextContent())

	return text
}
