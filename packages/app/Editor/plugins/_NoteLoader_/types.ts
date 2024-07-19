export interface IPropsDataLoader {
	collection: 'note_items'
}

export interface Change {
	type: 'add' | 'remove' | 'update'
	id: string
}
