import { $createCodeNode } from './index'

import type { DOMConversionOutput } from 'lexical'
import type { BundledLanguage } from 'shiki'

export default (dom: HTMLElement): DOMConversionOutput => {
	const lang = dom.getAttribute('lexical-code-lang') as BundledLanguage

	if (!lang) return null

	const node = $createCodeNode({ lang })

	return { node }
}
