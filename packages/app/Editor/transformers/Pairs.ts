import { $getSelection, $isRangeSelection } from 'lexical'

import type { TextMatchTransformer } from '@lexical/markdown'

const pairs = [
	{ open: '(', close: ')' },
	{ open: '[', close: ']' },
	{ open: '"', close: '"' },
	{ open: `'`, close: `'` }
]

export default pairs.map(
	item =>
		({
			type: 'text-match',
			regExp: new RegExp(`\\${item.open}\\s*(?=\\s|$)`, 'g'),
			dependencies: [],
			trigger: item.open,
			useAllText: true,
			replace(_1, _2, offset) {
				const selection = $getSelection()

				if (!$isRangeSelection(selection)) return

				selection.insertText(item.close)

				selection.anchor.set(selection.anchor.key, offset!, 'text')
				selection.focus.set(selection.focus.key, offset!, 'text')
			}
		}) as TextMatchTransformer
)
