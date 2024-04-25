import { $createCodeNode } from './index'

import type { DOMConversionOutput } from 'lexical'

export default (dom: HTMLElement): DOMConversionOutput | null => {
	const value = atob(dom.getAttribute('data-lexical-code') || '')
	const lang = dom.getAttribute('data-lexical-lang') || 'js'

	if (value) {
		const node = $createCodeNode({ value, lang })

		return { node }
	}

	return null
}
