import { $createMermaidNode } from './index'

import type { DOMConversionOutput } from 'lexical'

export default (domNode: HTMLElement): DOMConversionOutput | null => {
	const value = atob(domNode.getAttribute('lexical-katex-value') || '')
	const inline = domNode.getAttribute('lexical-katex-inline') === 'true'

	if (value) {
		const node = $createMermaidNode({ value, inline })

		return { node }
	}

	return null
}
