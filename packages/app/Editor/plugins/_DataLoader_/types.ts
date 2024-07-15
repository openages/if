import type { NodeKey, EditorState } from 'lexical'

export interface IPropsDataLoader {
	collection: 'note_items'
}

export interface UpdateListenerArgs {
	dirtyElements: Map<NodeKey, boolean>
	dirtyLeaves: Set<NodeKey>
	editorState: EditorState
	normalizedNodes: Set<NodeKey>
	prevEditorState: EditorState
	tags: Set<string>
}

export interface Change {
	type: 'add' | 'remove' | 'update'
	id: string
}
