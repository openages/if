import type { LexicalEditor } from 'lexical'

export interface IPropsTextLoader {
	max_length?: number
	linebreak?: boolean
	onChange: (state: string) => void
	setEditor: (editor: LexicalEditor) => void
	onKeyDown?: (e: KeyboardEvent) => void
	onFocus?: (v: boolean) => void
}
