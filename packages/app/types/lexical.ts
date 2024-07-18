import type { NodeKey, EditorState } from 'lexical'

export namespace Lexical {
	export interface ArgsUpdateListener {
		dirtyElements: Map<NodeKey, boolean>
		dirtyLeaves: Set<NodeKey>
		editorState: EditorState
		normalizedNodes: Set<NodeKey>
		prevEditorState: EditorState
		tags: Set<string>
	}
}
