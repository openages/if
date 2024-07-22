import { LexicalEditor } from 'lexical'

export interface IPropsDataLoader {
	collection: 'note_items'
	setEditor?: (editor: LexicalEditor) => void
}

export interface Change {
	type: 'add' | 'remove' | 'update'
	id: string
}
