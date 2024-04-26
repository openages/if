import { $createCodeNode } from './index'

import type { DOMConversionOutput } from 'lexical'
import type { BundledLanguage } from 'shiki'

export default (dom: HTMLElement): DOMConversionOutput | null => {
	const value = atob(dom.getAttribute('data-lexical-code') || '')
	const lang = (dom.getAttribute('data-lexical-lang') || 'js') as BundledLanguage

	if (value) {
		const node = $createCodeNode({ value, lang })

		return { node }
	}

	return null
}
