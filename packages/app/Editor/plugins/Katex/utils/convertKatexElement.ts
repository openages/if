import { $createKatexNode } from './index'

import type { DOMConversionOutput } from 'lexical'

export default (domNode: HTMLElement): DOMConversionOutput | null => {
	const value = atob(domNode.getAttribute('data-lexical-katex') || '')
	const inline = domNode.getAttribute('data-lexical-inline') === 'true'

	if (value) {
		const node = $createKatexNode({ value, inline })

		return { node }
	}

	return null
}
