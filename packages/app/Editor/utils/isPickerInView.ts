import type { LexicalEditor } from 'lexical'

export default (editor: LexicalEditor) => {
	const root = editor.getRootElement()

	return root.hasAttribute('aria-controls') && root.getAttribute('aria-controls') === 'typeahead-menu'
}
