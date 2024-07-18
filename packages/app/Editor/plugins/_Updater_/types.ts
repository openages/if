import type { LexicalEditor } from 'lexical'

export interface IPropsUpdater {
	max_length?: number
	onChange: (state: string) => void
	setEditor: (editor: LexicalEditor) => void
	onKeyDown?: (e: KeyboardEvent) => void
}
