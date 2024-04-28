import { $createCodeNode } from './index'

import type { DOMConversionOutput } from 'lexical'
import type { BundledLanguage } from 'shiki'

export default (dom: HTMLElement): DOMConversionOutput | null => {
	const lang = (dom.getAttribute('lexical-code-lang') || 'js') as BundledLanguage

	if (lang) {
		const node = $createCodeNode({ lang })

		return { node }
	}

	return null
}
