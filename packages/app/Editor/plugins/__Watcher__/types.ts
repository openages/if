import type { NodeKey, EditorState } from 'lexical'

export interface UpdateListenerArgs {
	dirtyElements: Map<NodeKey, boolean>
	dirtyLeaves: Set<NodeKey>
	editorState: EditorState
	normalizedNodes: Set<NodeKey>
	prevEditorState: EditorState
	tags: Set<string>
}
